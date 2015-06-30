var fs = require('fs');

var DATA_FOLDER = "data";
var SEPARATOR = ":";

function getPluginEventName(plugin, event) {
    return plugin + SEPARATOR + event;
}

function API(Vapor, pluginName) {
    this._vapor = Vapor;
    this._utils = Vapor.utils;
    this._pluginName = pluginName;
}

API.prototype.getClient = function() {
    return this._vapor.client;
};

API.prototype.getUtils = function() {
    return this._utils;
};

API.prototype.getSteam = function() {
    return this._vapor.Steam;
};

API.prototype.getConfig = function() {
    return this._vapor.config.plugins[this._pluginName];
};

API.prototype.emitEvent = function(event, data) {
    var vapor = this._vapor;
    var eventName = getPluginEventName(this._pluginName, event);

    vapor.emit(eventName, data);
};

API.prototype.registerHandler = function(options) {    
    if(options.emitter === 'plugin' && !options.plugin) {
        throw Error("Missing 'plugin' property in options in 'registerHandler' method.");
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
            throw Error("Unknown event emitter " + options.emitter + " in 'registerHandler' method.");
    }
};

API.prototype.removeAllHandlers = function(options) {
    if(options.emitter === 'plugin' && !options.plugin) {
        throw Error("Missing 'plugin' property in options in 'removeAllHandlers' method.");
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
            throw Error("Unknown event emitter " + options.emitter + " in 'removeAllHandlers' method.");
    }
};

API.prototype.getPluginFolderPath = function() {
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

module.exports = API;

