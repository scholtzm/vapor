var fs = require('fs');

/**
 * Default event handler for servers event.
 * @param  {object} servers Server list.
 */
module.exports = function(servers) {
    var serverList = this.serverList;
    var log = this.log;

    log.debug("Received new Steam server list!");

    var serverListDir = serverList.replace('list.json', '');
    if(!fs.existsSync(serverListDir)) {
        fs.mkdirSync(serverListDir);
    }

    fs.writeFile(serverList, JSON.stringify(servers));
};
