/**
 * Dependencies.
 */
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var https = require('https');

var Steam = require('steam');
var SteamGroups = require('steam-groups');
var SteamCrypto = require('steam-crypto');

var API = require('./api');
var Utils = require('./utils');
var appinfo = require('../package.json');

/**
 * Export Vapor module.
 * @type {Vapor}
 */
module.exports = Vapor;

/**
 * Vapor class.
 * @constructor
 */
function Vapor() {
    this.cwd = process.cwd();

    // Setup servers if possible
    this.serverListPath = this.cwd + '/data/misc/servers.json';

    // Parse server list if we have one
    if(fs.existsSync(this.serverListPath)) {
        Steam.servers = JSON.parse(fs.readFileSync(this.serverListPath));
    }

    // Utils can be used by Vapor too
    this.utils = new Utils(this);

    // This is useful for enums
    this.Steam = Steam;

    // Main steam client
    this.client = new Steam.SteamClient();

    // Handlers
    this.steamUser = new Steam.SteamUser(this.client);
    this.steamFriends = new Steam.SteamFriends(this.client);
    this.steamTrading = new Steam.SteamTrading(this.client);
    this.steamGameCoordinator = new Steam.SteamGameCoordinator(this.client);

    // Extra handlers
    this.steamGroups = new SteamGroups(this.client);

    // Array of loaded plugins - built-in and external
    this.loadedPlugins = [];

    // Login options object
    this.loginOptions = {};
}

// Make Vapor an event emitter
util.inherits(Vapor, EventEmitter);

/**
 * Initialize Vapor bot.
 * @param config Configuration object.
 */
Vapor.prototype.init = function(config) {
    // Save config
    this.config = config;

    // Set login values from ENV variables if possible
    this.config.username = process.env.VAPOR_USER || config.username;
    this.config.password = process.env.VAPOR_PASS || config.password;

    process.env.VAPOR_USER = "";
    process.env.VAPOR_PASS = "";

    // Create folders
    createFolderStructure();

    // Setup sentry file path for specific bot
    this.sentryFilePath = this.cwd + '/data/sentry/' + config.username + '.sentry';

    // Initiate our logger
    this.log = require('./logger')(config);

    this.log.info("Starting " + appinfo.name + " v" + appinfo.version);
    this.log.info("Launching bot: " + config.displayName + " (" + config.username + ")");

    // Register handlers
    require('./handlers/')(this);

    // Load plugins
    this._loadPlugins();

    // Let's connect to Steam
    this.client.connect();

    // Handle SIGINT
    process.on('SIGINT', function() {
        this.shutdown();
    }.bind(this));
};

/**
 * Gracefully shuts down Vapor.
 */
Vapor.prototype.shutdown = function() {
    this.log.info("Disconnecting and shutting down.");
    this.client.disconnect();

    setTimeout(function() {
        process.exit(0);
    }, 1000);
};

/**
 * Internal webLogOn method.
 *
 * Adopted from node-steam v0.6.8 by seishun.
 * @param  {string}   webLoginKey Login key provided by the logOn method.
 * @param  {Function} callback    Callback function which receives the cookie array.
 */
Vapor.prototype.webLogOn = function(webLoginKey, callback) {
    var self = this;

    var sessionKey = SteamCrypto.generateSessionKey();

    var data = 'steamid=' + self.client.steamID +
        '&sessionkey=' + sessionKey.encrypted.toString('hex').replace(/../g, '%$&') +
        '&encrypted_loginkey=' + SteamCrypto.symmetricEncrypt(new Buffer(webLoginKey), sessionKey.plain).toString('hex').replace(/../g, '%$&');

    var options = {
        hostname: 'api.steampowered.com',
        path: '/ISteamUserAuth/AuthenticateUser/v1',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    };

    var req = https.request(options, function(res) {
        if (res.statusCode === 200) {
            res.on('data', function(chunk) {
                var response = JSON.parse(chunk);
                var sessionID = Math.floor(Math.random() * 1000000000).toString();

                callback([
                    'sessionid=' + sessionID,
                    'steamLogin=' + response.authenticateuser.token,
                    'steamLoginSecure=' + response.authenticateuser.tokensecure
                ]);
            });
        } else {
            self.steamUser.requestWebAPIAuthenticateUserNonce(function(nonce) {
                self.webLogOn(nonce.webapi_authenticate_user_nonce, callback);
            });

            return;
        }
    });

    req.on('error', function() {
        self.webLogOn(webLoginKey, callback);
    });

    req.end(data);
};


/**
 * Plugin loader.
 * @private
 */
Vapor.prototype._loadPlugins = function() {
    var vapor = this;
    var config = this.config;
    var pluginList = Object.keys(config.plugins);

    if(config.plugins && pluginList.length > 0) {

        pluginList.forEach(function(plugin) {


            if(plugin === "")
                return;

            if(!!~vapor.loadedPlugins.indexOf(plugin)) {
                vapor.log.warn('Plugin ' + plugin + ' is already loaded. Please check your settings.');
                return;
            }

            var errors = [];
            var pluginHasBeenLoaded = false;

            vapor.log.debug('Loading ' + plugin + '...');

            // First, try to load it as built-in plugin
            try {
                pluginHasBeenLoaded = vapor._requirePlugin('./plugins/' + plugin);
            } catch(err) {
                errors.push(err);
            }

            // If we fail, it might be an external plugin
            if(!pluginHasBeenLoaded) {
                try {
                    vapor._requirePlugin(plugin);
                } catch(err) {
                    vapor.log.error('Failed to load plugin: ' + plugin);
                    errors.push(err);

                    vapor.log.error('Built-in plugin loader error:');
                    vapor.log.error(errors[0]);
                    vapor.log.error('External plugin loader error:');
                    vapor.log.error(errors[1]);

                    // Being able to load all plugins is critical, abort
                    process.exit(1);
                }
            }

            vapor.loadedPlugins.push(plugin);

            vapor.log.info('Plugin ' + plugin + ' has been loaded successfully.');
        });

    }

};

/**
 * Requires single Vapor plugin.
 * @private
 */
Vapor.prototype._requirePlugin = function(plugin) {
    var vapor = this;

    var pluginFunc = require(plugin);

    if(typeof pluginFunc === 'function') {
        pluginFunc(Object.seal(new API(vapor, plugin.replace("./plugins/", ""))));
        return true;
    } else {
        vapor.log.error("'" + plugin + "' is not a valid Vapor plugin. Aborting.");
        process.exit(1);
    }
};

/**
 * Creates necessary folder structure.
 */
function createFolderStructure() {
    var cwd = process.cwd();

    var paths = [
        cwd + "/data",
        cwd + "/data/logs",
        cwd + "/data/misc",
        cwd + "/data/plugins",
        cwd + "/data/sentry"
    ];

    for (var i = 0; i < paths.length; i++) {
        if(!fs.existsSync(paths[i])) {
            fs.mkdirSync(paths[i]);
        }
    }
}
