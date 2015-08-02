var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var https = require('https');
var crypto = require('crypto');

var Steam = require('steam');
var SteamGroups = require('steam-groups');
var SteamCrypto = require('steam-crypto');

var appinfo = require('../package.json');
var API = require('./api.js');
var Utils = require('./utils.js');
var Misc = require('./misc.js');

/**
 * Export Vapor module.
 * @type {Vapor}
 */
module.exports = Vapor;

/**
 * Main Vapor class.
 *
 * Instance of this class is never created manually.
 * @example
 * var vapor = require('vapor');
 * var bot = vapor();
 * @constructor
 */
function Vapor() {
    // Array of loaded plugins - built-in and external
    this.loadedPlugins = [];

    // Login options object
    this.loginOptions = {};
}

// Make Vapor an event emitter
util.inherits(Vapor, EventEmitter);

/**
 * Initializes Vapor instance.
 *
 * Properties:
 * * `username` - username used for logging in
 * * `password` - password used for logging in
 * * `displayName` - this is the name everyone else sees
 * * `state` - initial online state
 * * `admins` - array of SteamID64 strings
 * * `logs` - settings used by the logger
 * * `logs.dateFormat` - date format used by the logger
 * * `logs.consoleLevel` - logger level used in the console
 * * `logs.fileLevel` - logger level used in the file
 * * `dataDir` - path to directory that will be used to store data such as logs, sentry files etc.
 * @example
 * // Example config object
 * // All properties are required
 * // This can be loaded from JSON file of course
 * var config = {
 *     username: 'myUsername',
 *     password: 'myPassword',
 *     displayName: 'Bot Name',
 *     state: 'Online',
 *     admins: [ '7656123456', '7656987654' ],
 *     logs: {
 *         dateFormat: 'YYYY-MM-DD HH:mm:ss',
 *         consoleLevel: 'debug',
 *         fileLevel: 'debug'
 *     },
 *     dataDir: './data'
 * };
 * @param  {Object} config Configuration object.
 */
Vapor.prototype.init = function(config) {
    // Store the config
    this.config = config;

    // Init logger
    this.log = require('./logger')(config);

    // Let's go
    this.log.info('Initializing %s v%s', appinfo.name, appinfo.version);

    // Create necessary folder structure
    Misc.createFolderStructure(config.dataDir);

    // Setup paths
    this.serverListPath = path.join(config.dataDir, 'misc', 'servers.json');
    this.sentryFilePath = path.join(config.dataDir, 'sentry', config.username + '.sentry');

    // Parse server list if we have one
    if(fs.existsSync(this.serverListPath)) {
        try {
            Steam.servers = JSON.parse(fs.readFileSync(this.serverListPath));
        } catch(error) {
            this.log.warn('Failed to load server list from cache.');
            this.log.warn(error);
        }
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

    // Register core handlers
    require('./handlers')(this);
};

/**
 * Vapor's plugin loader.
 * @param  {Object} plugin     Plugin object.
 * @param  {*}        data       Extra data passed to VaporAPI. Use object for multiple values.
 */
Vapor.prototype.use = function(plugin, data) {
    // Check arguments
    if(typeof plugin.name !== 'string') {
        throw new Error('Provided argument "plugin.name" is not type of string in "Vapor.use"');
    }

    if(typeof plugin.plugin !== 'function') {
        throw new Error('Provided argument "plugin.plugin" is not type of function in "Vapor.use"');
    }

    // Do not allow 2 plugins to share the same plugin name
    if(!!~this.loadedPlugins.indexOf(plugin.name)) {
        this.log.warn('Plugin %s is already loaded. Please check your settings.', plugin.name);
        return;
    }

    // Call it
    plugin.plugin(Object.seal(new API(this, plugin.name, data)));

    // Mark as loaded
    this.loadedPlugins.push(plugin.name);

    this.log.info('"%s" has been loaded successfully.', plugin.name);
};

/**
 * Connects Vapor to Steam network.
 */
Vapor.prototype.connect = function() {
    this.log.info('Connecting to Steam network: %s (%s)', this.config.displayName, this.config.username);

    // Let's connect to Steam
    this.client.connect();
};

/**
 * Disconnects Vapor from Steam network.
 */
Vapor.prototype.disconnect = function() {
    this.log.info('Disconnecting and shutting down.');
    this.client.disconnect();
};

/**
 * Internal webLogOn method.
 *
 * Adopted from node-steam v0.6.8 by seishun.
 * @param  {string}   webLoginKey Login key provided by the logOn method.
 * @private
 */
Vapor.prototype.webLogOn = function(webLoginKey) {
    var _this = this;

    var sessionKey = SteamCrypto.generateSessionKey();

    var data = 'steamid=' + _this.client.steamID +
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

                var cookies = [
                    'sessionid=' + crypto.randomBytes(12).toString('hex'),
                    'steamLogin=' + response.authenticateuser.token,
                    'steamLoginSecure=' + response.authenticateuser.tokensecure
                ];

                _this.log.info('Received new web cookies.');
                _this.cookies = cookies;
                _this.emit('cookies', cookies);
            });
        } else {
            _this.log.warn('Received status %d in "webLogOn". Retrying...', res.statusCode);

            _this.steamUser.requestWebAPIAuthenticateUserNonce(function(nonce) {
                _this.webLogOn(nonce.webapi_authenticate_user_nonce);
            });

            return;
        }
    });

    req.on('error', function() {
        _this.log.warn('Request in "webLogOn" failed. Retrying...');

        _this.webLogOn(webLoginKey);
    });

    req.end(data);
};
