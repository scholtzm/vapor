var fs = require('fs');

module.exports = API;

function API(Vapor) {
    this.vapor = Vapor;
    this.utils = Vapor.utils;
}

API.prototype.getClient = function() {
    return this.vapor.client;
};

API.prototype.registerHandler = function(emitter, event, callback) {
    var vapor = this.vapor;

    switch(emitter) {
        case 'vapor':
            vapor.on(event, callback.bind(vapor));
            break;

        case 'steam':
            vapor.client.on(event, callback.bind(vapor));
            break;

        default:
            throw Error("Unknown event emitter " + emitter + " in 'API.prototype.registerHandler' function.");
    }
};

API.prototype.removeAllHandlers = function(emitter, event) {
    var vapor = this.vapor;

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

API.prototype.getPluginFolderPath = function(pluginName) {
    var name = this.utils.getShortPluginName(pluginName);

    var vapor = this.vapor;
    var botSpecificPath = vapor.cwd + '/plugins/' + vapor.config.username;
    var pluginPath = botSpecificPath + '/' + name;

    if(!fs.existsSync(botSpecificPath))
        fs.mkdirSync(botSpecificPath);

    if(!fs.existsSync(pluginPath))
        fs.mkdirSync(pluginPath);

    return pluginPath;
};

API.prototype.getLogger = function(pluginName) {
    var log = this.vapor.log;
    var name = this.utils.getShortPluginName(pluginName);

    var prefix = '[' + name + ']';

    return {
        debug: function(message) { log.debug(prefix + ' ' + message); },
        error: function(message) { log.error(prefix + ' ' + message); },
        warn: function(message) { log.warn(prefix + ' ' + message); },
        info: function(message) { log.info(prefix + ' ' + message); }
    };
};
