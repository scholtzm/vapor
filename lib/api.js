var fs = require('fs');

var DATA_FOLDER = "data";

module.exports = API;

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

API.prototype.registerHandler = function(emitter, event, callback) {
    var vapor = this._vapor;

    switch(emitter) {
        case 'vapor':
            vapor.on(event, callback);
            break;

        case 'steam':
            vapor.client.on(event, callback);
            break;

        default:
            throw Error("Unknown event emitter " + emitter + " in 'API.prototype.registerHandler' function.");
    }
};

API.prototype.removeAllHandlers = function(emitter, event) {
    var vapor = this._vapor;

    switch(emitter) {
        case 'vapor':
            vapor.removeAllListeners(event);
            break;

        case 'steam':
            vapor.client.removeAllListeners(event);
            break;

        default:
            throw Error("Unknown event emitter " + emitter + " in 'API.prototype.removeAllHandlers' function.");
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
