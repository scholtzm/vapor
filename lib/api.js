var fs = require('fs');
var Utils = require('./utils');

var DATA_FOLDER = "data/plugins";
var SEPARATOR = ":";

// Keeping Vapor instance private.
var _vapor;

// Private method to generate event names for plugins.
function _getPluginEventName(plugin, event) {
    return plugin + SEPARATOR + event;
}

/**
 * Exports API class.
 */
module.exports = API;

/**
 * API class constructor.
 * Instance of this class is passed to plugins exported function.
 * @class
 * @param    {Object} Vapor      Vapor instance.
 * @param    {string} pluginName Specific plugin name which uses this API instance.
 * @property {string} pluginName Name of the plugin which uses this specific API instance.
 */
function API(Vapor, pluginName) {
    _vapor = Vapor;
    this._utils = new Utils(_vapor);

    // Public property
    this.pluginName = pluginName;
}

/**
 * Disconnects from Steam network and completely shuts down Vapor process.
 */
API.prototype.shutdown = function() {
    _vapor.shutdown();
};

/**
 * Returns active Steam client used by Vapor.
 * @return {Object} Active Steam client.
 */
API.prototype.getClient = function() {
    return _vapor.client;
};

/**
 * Returns active Steam handler used by Vapor.
 * @param  {string} handler Can be either 'steamUser', 'steamFriends', 'steamTrading',
 * 'steamGameCoordinator' or 'steamGroups'.
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
            throw new Error("Unknown handler " + handler + " in 'getHandler' method.");
    }
};

/**
 * Returns Utils class.
 * @return {Object} Instantiated Utils class.
 */
API.prototype.getUtils = function() {
    return this._utils;
};

/**
 * Returns Steam object.
 * This is useful for all the ESomething enums.
 * @return {Object} Steam.
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
 * Saves config object back to file.
 * @param  {Object} configObject Configuration object to be saved.
 */
API.prototype.saveConfig = function(configObject) {
    var path = "./config.json";

    if(process.argv.length > 2)
        path = process.argv[2];

    fs.writeFileSync(path, JSON.stringify(configObject, null, 2));
};

/**
 * Allows plugin to emit custom events via Vapors event emitter.
 * @param  {string} event Event name.
 * @param  {...*}   data  Data.
 */
API.prototype.emitEvent = function() {
    var args = arguments;
    args[0] = _getPluginEventName(this.pluginName, args[0]);

    _vapor.emit.apply(_vapor, args);
};

/**
 * Allows plugin to register custom handler for any event.
 * @example
 * API.registerHandler({
 *         emitter: 'steam',
 *         event: 'friendMsg'
 *     },
 *     function(user, message, type) {
 *         if(type === Steam.EChatEntryType.ChatMsg) {
 *             log.info(user + " says: " + message);
 *         }
 *     }
 * );
 * @param  {Object}    options          Options object.
 * @param  {string}    options.emitter  Can be either 'vapor', 'client', 'steamUser',
 * 'steamFriends', 'steamTrading', 'steamGameCoordinator' or 'plugin'.
 * @param  {string}    options.plugin - If emitter is plugin, this is plugin's name.
 * @param  {string}    options.event    Event name.
 * @param  {function}  callback         Callback function.
 */
API.prototype.registerHandler = function(options, callback) {
    if(options.emitter === 'plugin' && !options.plugin) {
        throw new Error("Missing 'plugin' property in options in 'registerHandler' method.");
    }

    if(typeof callback !== 'function') {
        throw new Error("Callback must be a function.");
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
            throw new Error("Unknown event emitter " + options.emitter + " in 'registerHandler' method.");
    }
};

/**
 * Allows plugin to remove all handlers for a specific event.
 * @param  {Object}  options          Options object.
 * @param  {string}  options.emitter  Can be either 'vapor', 'client', 'steamUser',
 * 'steamFriends', 'steamTrading', 'steamGameCoordinator' or 'plugin'.
 * @param  {string}  options.plugin - If emitter is 'plugin', this is plugin's name.
 * @param  {string}  options.event    Event name.
 */
API.prototype.removeAllHandlers = function(options) {
    if(options.emitter === 'plugin' && !options.plugin) {
        throw new Error("Missing 'plugin' property in options in 'removeAllHandlers' method.");
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
            throw new Error("Unknown event emitter " + options.emitter + " in 'removeAllHandlers' method.");
    }
};

/**
 * Returns plugin's data folder path.
 * @return {string} Full path to plugin's data folder.
 */
API.prototype.getDataFolderPath = function() {
    var vapor = _vapor;
    var botSpecificPath = vapor.cwd + '/' + DATA_FOLDER + '/' + vapor.config.username;
    var pluginPath = botSpecificPath + '/' + this.pluginName;

    if(!fs.existsSync(botSpecificPath))
        fs.mkdirSync(botSpecificPath);

    if(!fs.existsSync(pluginPath))
        fs.mkdirSync(pluginPath);

    return pluginPath;
};

/**
 * Returns logger prefixed with plugin's name.
 * @return {Object} Logger.
 */
API.prototype.getLogger = function() {
    var log = _vapor.log;
    var name = this._utils.getShortPluginName(this.pluginName);

    var prefix = '[' + name + '] ';

    // This is quite ugly.
    return {
        verbose: function(message) { log.verbose(prefix + message); },
        debug: function(message) { log.debug(prefix + message); },
        error: function(message) { log.error(prefix + message); },
        warn: function(message) { log.warn(prefix + message); },
        info: function(message) { log.info(prefix + message); }
    };
};
