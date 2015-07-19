/**
 * Dependencies.
 */
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Steam = require('steam');
var SteamGroups = require('steam-groups');

var API = require('./api');
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
    this.config = config;

    // Set login values from ENV variables if possible
    this.config.username = process.env.VAPOR_USER || config.username;
    this.config.password = process.env.VAPOR_PASS || config.password;

    process.env.VAPOR_USER = "";
    process.env.VAPOR_PASS = "";

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
        pluginFunc(Object.seal(new API(vapor, plugin)));
        return true;
    } else {
        vapor.log.error("'" + plugin + "' is not a valid Vapor plugin. Aborting.");
        process.exit(1);
    }
};
