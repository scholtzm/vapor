/**
 * Dependencies.
 */
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Steam = require('steam');
require('steam-groups')(Steam);

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

  // This is for useful enums
  this.Steam = Steam;

  this.client = new Steam.SteamClient();

  this.utils = new Utils(this);
  this.api = new API(this);

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

    // Initiate our logger
    this.log = require('./logger')(config);

    this.log.info("Starting " + appinfo.name + " v" + appinfo.version);
    this.log.info("Launching bot: " + config.username);

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

Vapor.prototype._loadPlugins = function() {
    var vapor = this;
    var config = this.config;

    if(config.plugins && config.plugins.length > 0) {

        config.plugins.forEach(function(plugin) {
            if(plugin === "")
                return;

            if(!!~vapor.loadedPlugins.indexOf(plugin)) {
                vapor.log.warn('Plugin ' + plugin + ' is already loaded. Please check your settings.');
                return;
            }

            try {
                require(plugin)(vapor);
            } catch(err) {
                vapor.log.error('Failed to load plugin: ' + plugin);
                vapor.log.error(err);
                return;
            }

            vapor.loadedPlugins.push(plugin);

            vapor.log.info('Plugin ' + plugin + ' was loaded successfully.');
        });

    }

};
