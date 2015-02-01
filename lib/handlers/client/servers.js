var fs = require('fs');

/**
 * Event handler for when our bot receives new server list.
 * @param servers Server list.
 */
module.exports = function(servers) {
    var serverList = this.serverList;
    var log = this.log;

    log.info("Received new Steam server list!");

    var serverListDir = serverList.replace('list.json', '');
    if(!fs.existsSync(serverListDir)) {
        fs.mkdirSync(serverListDir);
    }

    fs.writeFile(serverList, JSON.stringify(servers));
};
