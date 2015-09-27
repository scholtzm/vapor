/**
 * Default event handler for servers event.
 * @param  {object} servers Server list.
 */
module.exports = function(servers) {
    this.emit('message:info', 'Received new Steam server list.');
    this.emit('writeFile', this._serverList, JSON.stringify(servers, null, 2), function(){});
};
