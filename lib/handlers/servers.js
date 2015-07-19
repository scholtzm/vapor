var fs = require('fs');

/**
 * Default event handler for servers event.
 * @param  {object} servers Server list.
 */
module.exports = function(servers) {
    var serverListPath = this.serverListPath;
    var log = this.log;

    log.debug("Received new Steam server list.");

    fs.writeFile(serverListPath, JSON.stringify(servers));
};
