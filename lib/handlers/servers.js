var fs = require('fs');

/**
 * Default event handler for servers event.
 * @param  {object} servers Server list.
 */
module.exports = function(servers) {
    var serverListPath = this.serverListPath;
    var log = this.log;

    log.debug("Received new Steam server list.");

    var serverListDir = serverListPath.replace('servers.json', '');
    if(!fs.existsSync(serverListDir)) {
        fs.mkdirSync(serverListDir);
    }

    fs.writeFile(serverListPath, JSON.stringify(servers));
};
