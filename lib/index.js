/**
 * Dependencies.
 */
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Steam = require('steam');
require('steam-groups')(Steam);

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

  // This is for useful enums
  this.Steam = Steam;
  this.client = new Steam.SteamClient();

  this.loadedPlugins = [];
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
    // Username needs to be preserved
    this.config.username = process.env.VAPOR_USER || config.username;
    this.config.password = process.env.VAPOR_PASS || config.password;

    process.env.VAPOR_USER = "";
    process.env.VAPOR_PASS = "";

    // Initiate our logger
    this.log = require('./logger')(config);

    this.log.info("Starting " + appinfo.name + " v" + appinfo.version);
    this.log.info("Launching bot: " + config.displayName + " (" + config.username + ")");

    // Set sentryFile and serverList
    this.sentryFile = this.cwd + '/sentry/' + config.username + '.sentry';
    this.serverList = this.cwd + '/servers/list.json';

    // Parse server list
    if(fs.existsSync(this.serverList)) {
        this.client.servers = JSON.parse(fs.readFileSync(this.serverList));
    }

    // Register handlers
    require('./handlers/')(this);

    // Load plugins
    this._loadPlugins();

    // Let's log in
    this._login(config.username, config.password);
};

/**
 * Login method.
 * @param username Steam account username.
 * @param password Steam account password.
 * @private
 */
Vapor.prototype._login = function(username, password) {
    var loginOptions = {
        accountName: username,
        password: password
    };

    if(fs.existsSync(this.sentryFile)) {
        loginOptions.shaSentryfile = fs.readFileSync(this.sentryFile);
    }

    this.client.logOn(loginOptions);
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

                    vapor.log.error(errors[0]);
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
