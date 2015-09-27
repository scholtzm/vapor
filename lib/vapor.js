var EventEmitter = require('events').EventEmitter;
var util = require('util');
var https = require('https');
var crypto = require('crypto');

var Steam = require('steam');
var SteamGroups = require('steam-groups');
var SteamCrypto = require('steam-crypto');

var API = require('./api.js');
var Utils = require('./utils.js');
var Helper = require('./helper.js');

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
 * @property {Object[]} servers List of Steam servers.
 * You can set this property to use your own up-to-date list of servers.
 * **Remark:** This property can be only set before calling {@link Vapor#init} method.
 * @constructor
 */
function Vapor() {
    // Public properties
    this.servers = Steam.servers;

    // Private properties
    // Array of loaded plugins - built-in and external
    this._loadedPlugins = [];

    // Login options object
    this._loginOptions = {};
}

// Make Vapor an event emitter
util.inherits(Vapor, EventEmitter);

/**
 * Initializes Vapor instance.
 *
 * Config properties:
 * * `username` - username used for logging in
 * * `password` - password used for logging in
 * * `displayName` - this is the name everyone else sees
 * * `state` - initial online state
 * * `admins` - array of SteamID64 strings
 *
 * Only `username` and `password` are required. See 'helper.js' for defaults.
 * @example
 * var config = {
 *     username: 'myUsername',
 *     password: 'myPassword',
 *     displayName: 'Vapor Bot',
 *     state: 'Online',
 *     admins: [ '7656123456', '7656987654' ]
 * };
 * bot.init(config);
 * @param  {Object} config Configuration object.
 */
Vapor.prototype.init = function(config) {
    // Set Steam servers
    Steam.servers = this.servers;

    // Verify config properties
    config = Helper.verifyConfig(config);

    // Store the config
    this._config = config;

    // Setup file names
    this._serverList = 'servers.json';
    this._sentryFile = config.username + '.sentry';

    // Utils can be used by Vapor too
    this._utils = new Utils(this);

    // This is useful for enums
    this._Steam = Steam;

    // Main steam client
    this._client = new Steam.SteamClient();

    // Handlers
    this._steamUser = new Steam.SteamUser(this._client);
    this._steamFriends = new Steam.SteamFriends(this._client);
    this._steamTrading = new Steam.SteamTrading(this._client);
    this._steamGameCoordinator = new Steam.SteamGameCoordinator(this._client);

    // Extra handlers
    this._steamGroups = new SteamGroups(this._client);

    // Register core handlers
    require('./handlers')(this);
};

/**
 * Use plugin.
 *
 * You can either specify a built-in plugin or use a custom plugin.
 * @param  {Object} plugin     Plugin object.
 * @param  {*}        data     Extra data passed to VaporAPI. Use `object` for multiple values.
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
    if(!!~this._loadedPlugins.indexOf(plugin.name)) {
        throw new Error('Plugin ' + plugin.name + ' is already loaded. Please check your settings.', plugin.name);
    }

    // Call it
    plugin.plugin(Object.seal(new API(this, plugin.name, data)));

    // Mark as loaded
    this._loadedPlugins.push(plugin.name);

    this.emit('message:info', 'Plugin "' + plugin.name + '" has been loaded successfully.');
};

/**
 * Connects Vapor to Steam network.
 */
Vapor.prototype.connect = function() {
    this.emit('message:info', 'Connecting to Steam network.');
    this._client.connect();
};

/**
 * Disconnects Vapor from Steam network.
 */
Vapor.prototype.disconnect = function() {
    this.emit('message:info', 'Disconnecting to Steam network.');
    this._client.disconnect();
};

/**
 * Internal webLogOn method.
 *
 * Adopted from node-steam v0.6.8 by seishun.
 * @param  {string}   webLoginKey Login key provided by the logOn method.
 * @private
 */
Vapor.prototype._webLogOn = function(webLoginKey) {
    var self = this;

    var sessionKey = SteamCrypto.generateSessionKey();

    var data = 'steamid=' + self._client.steamID +
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

                var sessionid = crypto.randomBytes(12).toString('hex');
                var cookies = [
                    'sessionid=' + sessionid,
                    'steamLogin=' + response.authenticateuser.token,
                    'steamLoginSecure=' + response.authenticateuser.tokensecure
                ];

                self.emit('message:info', 'Received new web cookies.');

                self._cookies = cookies;
                self.emit('cookies', cookies, sessionid);
            });
        } else {
            self.emit('message:warn', 'Received status ' + res.statusCode + ' in "webLogOn". Retrying...');

            self.steamUser.requestWebAPIAuthenticateUserNonce(function(nonce) {
                self._webLogOn(nonce.webapi_authenticate_user_nonce);
            });

            return;
        }
    });

    req.on('error', function() {
        self.emit('message:warn', 'Request in "webLogOn" failed. Retrying...');

        self._webLogOn(webLoginKey);
    });

    req.end(data);
};
