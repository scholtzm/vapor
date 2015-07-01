var fs = require('fs');

var DATA_FOLDER = "data";
var SEPARATOR = ":";

function getPluginEventName(plugin, event) {
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
    this._vapor = Vapor;
    this._utils = Vapor.utils;
    this._pluginName = pluginName;
}

/**
 * Returns active Steam client used by Vapor.
 * This client is also extended by steam-groups module.
 * @return {Object} Active Steam client.
 */
API.prototype.getClient = function() {
    return this._vapor.client;
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
    return this._vapor.Steam;
};

/**
 * Returns config for this specific plugin.
 * @return {Object} Config object.
 */
API.prototype.getConfig = function() {
    return this._vapor.config.plugins[this._pluginName];
};

/**
 * Allows plugin to emit custom events via Vapors event emitter.
 * @param  {string} event Event name.
 * @param  {*}      data  Data.
 */
API.prototype.emitEvent = function(event, data) {
    var vapor = this._vapor;
    var eventName = getPluginEventName(this._pluginName, event);

    vapor.emit(eventName, data);
};

/**
 * Allows plugin to register custom handler for any event.
 * @example
 * API.registerHandler({
 *     emitter: 'steam',
 *     event: 'friendMsg',
 *     callback: function(user, message, type) {
 *         if(type === Steam.EChatEntryType.ChatMsg) {
 *             log.info(user + " says: " + message);
 *         }
 *     }
 * });
 * @param  {Object}    options          Options object.
 * @param  {string}    options.emitter  Can be either 'vapor', 'steam' or 'plugin'.
 * @param  {string}    options.plugin - If emitter is plugin, this is plugin's name.
 * @param  {string}    options.event    Event name.
 * @param  {function}  options.callback Callback function.
 */
API.prototype.registerHandler = function(options) {    
    if(options.emitter === 'plugin' && !options.plugin) {
        throw new Error("Missing 'plugin' property in options in 'registerHandler' method.");
    }

    var vapor = this._vapor;

    switch(options.emitter) {
        case 'vapor':
            vapor.on(options.event, options.callback);
            break;

        case 'steam':
            vapor.client.on(options.event, options.callback);
            break;

        case 'plugin':
            var eventName = getPluginEventName(options.plugin, options.event);
            vapor.on(eventName, options.callback);
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

    var vapor = this._vapor;

    switch(options.emitter) {
        case 'vapor':
            vapor.removeAllListeners(options.event);
            break;

        case 'steam':
            vapor.client.removeAllListeners(options.event);
            break;

        case 'plugin':
            var eventName = getPluginEventName(options.plugin, options.event);
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
    var name = this._utils.getShortPluginName(this._pluginName);

    var vapor = this._vapor;
    var botSpecificPath = vapor.cwd + '/' + DATA_FOLDER + '/' + vapor.config.username;
    var pluginPath = botSpecificPath + '/' + name;

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
    var log = this._vapor.log;
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
