var fs = require('fs');
var util = require('util');
var path = require('path');
var mkdirp = require('mkdirp');

var Misc = require('./misc.js');

var SEPARATOR = ':';

// Keeping Vapor instance private.
var _vapor;

// Private method to generate event names for plugins.
function _getPluginEventName(plugin, event) {
    return plugin + SEPARATOR + event;
}

// Private function to create shortened plugin name
function _getShortPluginName(pluginName) {
    if(pluginName.indexOf('vapor-') === 0)
        return pluginName.replace('vapor-', '');

    return pluginName;
}

/**
 * Exports API class.
 */
module.exports = API;

/**
 * API class constructor.
 *
 * Instance of this class is passed to plugins exported function.
 * @class
 * @param    {Vapor}  Vapor      Vapor instance.
 * @param    {string} pluginName Specific plugin name which uses this API instance.
 * @param    {Object} data       Data object that is passed to API instance.
 * @property {string} pluginName Name of the plugin which uses this specific API instance.
 * @property {Object} data       Data object that is passed to API instance.
 */
function API(Vapor, pluginName, data) {
    _vapor = Vapor;
    this._dataDir = path.join(_vapor.config.dataDir, Misc.DATA_PLUGIN_DIR, _vapor.config.username, pluginName);

    // Public properties
    this.pluginName = pluginName;
    this.data = data;
}

/**
 * Connect to Steam network.
 */
API.prototype.connect = function() {
    _vapor.connect();
};

/**
 * Disconnect from Steam network.
 */
API.prototype.disconnect = function() {
    _vapor.disconnect();
};

/**
 * Returns active Steam client used by Vapor.
 * @return {SteamClient} Active Steam client.
 */
API.prototype.getClient = function() {
    return _vapor.client;
};

/**
 * Returns active Steam handler used by Vapor.
 * @param  {string} handler Can be either `steamUser`, `steamFriends`, `steamTrading`,
 * `steamGameCoordinator` or `steamGroups`.
 * @return {Object}         Active Steam handler.
 */
API.prototype.getHandler = function(handler) {
    switch (handler) {
        case 'steamUser':
            return _vapor.steamUser;
        case 'steamFriends':
            return _vapor.steamFriends;
        case 'steamTrading':
            return _vapor.steamTrading;
        case 'steamGameCoordinator':
            return _vapor.steamGameCoordinator;
        case 'steamGroups':
            return _vapor.steamGroups;
        default:
            throw new Error('Unknown handler ' + handler + ' in "getHandler" method.');
    }
};

/**
 * Returns instance of Utils class.
 * @return {Utils} Instantiated Utils class.
 */
API.prototype.getUtils = function() {
    return _vapor.utils;
};

/**
 * Returns Steam object.
 *
 * This is especially useful for all the ESomething enums.
 * @return {Steam} Steam.
 */
API.prototype.getSteam = function() {
    return _vapor.Steam;
};

/**
 * Returns Vapor config object.
 * @return {Object} Config object.
 */
API.prototype.getConfig = function() {
    return _vapor.config;
};

/**
 * Allows plugin to emit custom events via Vapor's event emitter.
 *
 * This function allows to pass multiple data arguments.
 *
 * Also see {@link API#registerHandler}.
 * @example
 * API.emitEvent('myCustomPluginEvent', someString, someObject);
 * @param  {string} event Event name.
 * @param  {...*}   args  Data arguments.
 */
API.prototype.emitEvent = function() {
    var args = arguments;
    args[0] = _getPluginEventName(this.pluginName, args[0]);

    _vapor.emit.apply(_vapor, args);
};

/**
 * Allows plugin to register custom handler for any event.
 *
 * Also see {@link API#emitEvent}.
 * @example
 * // Listen to 'friendMsg' event emitted by 'steamFriends'
 * API.registerHandler({
 *         emitter: 'steamFriends',
 *         event: 'friendMsg'
 *     },
 *     function(user, message, type) {
 *         if(type === Steam.EChatEntryType.ChatMsg) {
 *             log.info(user + " says: " + message);
 *         }
 *     }
 * );
 *
 * // Listen to another plugin's custom event
 * API.registerHandler({
 *         emitter: 'plugin',
 *         plugin: 'another-plugin-name'
 *         event: 'myCustomPluginEvent'
 *     },
 *     function(someString, someObject) {
 *         log.info(someString, someObject);
 *     }
 * );
 *
 * @param  {Object}    options          Options object.
 * @param  {string}    options.emitter  Can be either `vapor`, `client`, `steamUser`,
 * `steamFriends`, `steamTrading`, `steamGameCoordinator` or `plugin`.
 * @param  {string}    options.plugin - If emitter is plugin, this is plugin's name.
 * @param  {string}    options.event    Event name.
 * @param  {function}  callback         Callback function.
 */
API.prototype.registerHandler = function(options, callback) {
    if(options.emitter === 'plugin' && !options.plugin) {
        throw new Error('Missing "plugin" property in options in "registerHandler" method.');
    }

    if(typeof callback !== 'function') {
        throw new Error('Callback must be a function.');
    }

    var vapor = _vapor;

    switch(options.emitter) {
        case 'vapor':
            vapor.on(options.event, callback);
            break;

        case 'client':
            vapor.client.on(options.event, callback);
            break;

        case 'steamUser':
            vapor.steamUser.on(options.event, callback);
            break;

        case 'steamFriends':
            vapor.steamFriends.on(options.event, callback);
            break;

        case 'steamTrading':
            vapor.steamTrading.on(options.event, callback);
            break;

        case 'steamGameCoordinator':
            vapor.steamGameCoordinator.on(options.event, callback);
            break;

        case 'plugin':
            var eventName = _getPluginEventName(options.plugin, options.event);
            vapor.on(eventName, callback);
            break;

        default:
            throw new Error('Unknown event emitter ' + options.emitter + ' in "registerHandler" method.');
    }
};

/**
 * Allows plugin to remove all handlers for a specific event.
 * @param  {Object}  options          Options object.
 * @param  {string}  options.emitter  Can be either `vapor`, `client`, `steamUser`,
 * `steamFriends`, `steamTrading`, `steamGameCoordinator` or `plugin`.
 * @param  {string}  options.plugin - If emitter is 'plugin', this is plugin's name.
 * @param  {string}  options.event    Event name.
 */
API.prototype.removeAllHandlers = function(options) {
    if(options.emitter === 'plugin' && !options.plugin) {
        throw new Error('Missing "plugin" property in options in "removeAllHandlers" method.');
    }

    var vapor = _vapor;

    switch(options.emitter) {
        case 'vapor':
            vapor.removeAllListeners(options.event);
            break;

        case 'client':
            vapor.client.removeAllListeners(options.event);
            break;

        case 'steamUser':
            vapor.steamUser.removeAllListeners(options.event);
            break;

        case 'steamFriends':
            vapor.steamFriends.removeAllListeners(options.event);
            break;

        case 'steamTrading':
            vapor.steamTrading.removeAllListeners(options.event);
            break;

        case 'steamGameCoordinator':
            vapor.steamGameCoordinator.removeAllListeners(options.event);
            break;

        case 'plugin':
            var eventName = _getPluginEventName(options.plugin, options.event);
            vapor.removeAllListeners(eventName);
            break;

        default:
            throw new Error('Unknown event emitter ' + options.emitter + ' in "removeAllHandlers" method.');
    }
};

/**
 * Returns plugin's data folder path.
 *
 * Plugin can use this folder to store persistent data.
 * @return {string} Full path to plugin's data folder.
 */
API.prototype.getDataFolderPath = function() {
    if(!fs.existsSync(this._dataDir))
        mkdirp.sync(this._dataDir);

    return this._dataDir;
};

/**
 * Returns wrapped logger instance prefixed with plugin's name.
 * @return {Object} Logger.
 */
API.prototype.getLogger = function() {
    var log = _vapor.log;
    var name = _getShortPluginName(this.pluginName);

    function filter(args, loggerFunc) {
        var message = util.format.apply(util.format, args);
        loggerFunc('[%s] %s', name, message);
    }

    // This is quite ugly.
    return {
        verbose: function() {
            filter(arguments, log.verbose);
        },
        debug: function() {
            filter(arguments, log.debug);
        },
        info: function() {
            filter(arguments, log.info);
        },
        warn: function() {
            filter(arguments, log.warn);
        },
        error: function() {
            filter(arguments, log.error);
        }
    };
};

/**
 * Calls Vapor's internal webLogOn method.
 *
 * Listen to `cookies` event to receive new array of cookies.
 *
 * You should call this function ONLY if you believe cookies have expired, e.g.
 * you logged into your account from another IP / browser and you are getting
 * HTTP 403 etc.
 *
 * You do NOT have to call this method on startup as it's automatically called
 * by Vapor after successfully logging in.
 */
API.prototype.webLogOn = function() {
    _vapor.steamUser.requestWebAPIAuthenticateUserNonce(function(nonce) {
        _vapor.webLogOn(nonce.webapi_authenticate_user_nonce);
    }.bind(_vapor));
};
