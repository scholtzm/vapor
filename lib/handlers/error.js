/**
 * Default event handler for error event.
 */
module.exports = function() {
    var Steam = this._Steam;

    this.emit('message:info', 'Disconnected from Steam network.');

    var error = new Error('Disconnected.');
    error.eresult = Steam.EResult.NoConnection;
    this.emit('disconnected', error);
};
