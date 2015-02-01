/**
 * Dependencies.
 */
var fs = require('fs');
var Steam = require('steam');
var SteamTradeOffers = require('steam-tradeoffers');
var appinfo = require('../package.json');

// Inject extra code for Steam groups.
require('steam-groups')(Steam);

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

  this.client = new Steam.SteamClient();
  this.tradeOffers = new SteamTradeOffers();
}

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
