var fs = require('fs');

module.exports = Extension;

function Extension(Vapor) {
    this.vapor = Vapor;
}

Extension.prototype.registerHandler = function(emitter, event, callback) {
    var vapor = this.vapor;

    switch(emitter) {
        case 'vapor':
            vapor.on(event, callback.bind(vapor));
            break;

        case 'steam':
            vapor.client.on(event, callback.bind(vapor));
            break;

        default:
            throw Error("Unknown event emitter " + emitter + " in 'Extension.prototype.registerHandler' function.");
    }
};

Extension.prototype.removeAllHandlers = function(emitter, event) {
    var vapor = this.vapor;

    switch(emitter) {
        case 'steam':
            vapor.client.removeAllListeners(event);
            break;

        case 'steam-tradeoffers':
            vapor.tradeOffers.removeAllListeners(event);
            break;

        default:
            throw Error("Unknown event emitter " + emitter + " in 'Extension.prototype.removeAllHandlers' function.");
    }
};

Extension.prototype.getPluginFolderPath = function(pluginName) {
    var vapor = this.vapor;
    var pluginPath = vapor.cwd + '/plugins/' + pluginName;
    var specificBotPath = pluginPath + '/' + vapor.config.username;

    if(!fs.existsSync(pluginPath))
        fs.mkdirSync(pluginPath);

    if(!fs.existsSync(specificBotPath))
        fs.mkdirSync(specificBotPath);

    return specificBotPath;
};
