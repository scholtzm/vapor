/**
 * Default event handler for servers event.
 * @param  {object} servers Server list.
 */
module.exports = function(servers) {
    this.log.debug('Received new Steam server list.');
    this.emit('writeFile', this.serverList, JSON.stringify(servers, null, 2));
};
