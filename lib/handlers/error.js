/**
 * Default event handler for error event.
 */
module.exports = function() {
    var log = this.log;
    var Steam = this.Steam;

    log.warn('Disconnected from Steam network.');

    var error = new Error('Disconnected.');
    error.eresult = Steam.EResult.NoConnection;
    this.emit('error', error);
};
