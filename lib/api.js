var fs = require('fs');
var Utils = require('./utils');

var DATA_FOLDER = "data";
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
 * @param {Object} Vapor      Vapor instance.
 * @param {string} pluginName Specific plugin name which uses this API instance.
 */
function API(Vapor, pluginName) {
    _vapor = Vapor;
    this._utils = new Utils(_vapor);
    this._pluginName = pluginName;
}

/**
 * Returns active Steam client used by Vapor.
 * This client is also extended by steam-groups module.
 * @return {Object} Active Steam client.
 */
API.prototype.getClient = function() {
    return _vapor.client;
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
 * Returns config for this specific plugin.
 * @return {Object} Config object.
 */
API.prototype.getConfig = function() {
    return _vapor.config.plugins[this._pluginName];
};

/**
 * Allows plugin to emit custom events via Vapors event emitter.
 * @param  {string} event Event name.
 * @param  {*}      data  Data.
 */
API.prototype.emitEvent = function(event, data) {
    var vapor = _vapor;
    var eventName = _getPluginEventName(this._pluginName, event);

    vapor.emit(eventName, data);
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
 * @param  {string}    options.emitter  Can be either 'vapor', 'steam' or 'plugin'.
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

        case 'steam':
            vapor.client.on(options.event, callback);
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
 * @param  {string}  options.emitter  Can be either 'vapor', 'steam' or 'plugin'.
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

        case 'steam':
            vapor.client.removeAllListeners(options.event);
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
    var pluginPath = botSpecificPath + '/' + this._pluginName;

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
    var name = this._utils.getShortPluginName(this._pluginName);

    var prefix = '[' + name + '] ';

    // This is quite ugly.
    return {
        debug: function(message) { log.debug(prefix + message); },
        error: function(message) { log.error(prefix + message); },
        warn: function(message) { log.warn(prefix + message); },
        info: function(message) { log.info(prefix + message); }
    };
};
