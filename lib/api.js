var fs = require('fs');

module.exports = API;

function API(Vapor) {
    this.vapor = Vapor;
}

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
        case 'steam':
            vapor.client.removeAllListeners(event);
            break;

        case 'steam-tradeoffers':
            vapor.tradeOffers.removeAllListeners(event);
            break;

        default:
            throw Error("Unknown event emitter " + emitter + " in 'API.prototype.removeAllHandlers' function.");
    }
};

API.prototype.getPluginFolderPath = function(pluginName) {
    var vapor = this.vapor;
    var botSpecificPath = vapor.cwd + '/plugins/' + vapor.config.username;
    var pluginPath = botSpecificPath + '/' + pluginName;

    if(!fs.existsSync(botSpecificPath))
        fs.mkdirSync(botSpecificPath);

    if(!fs.existsSync(pluginPath))
        fs.mkdirSync(pluginPath);

    return pluginPath;
};
