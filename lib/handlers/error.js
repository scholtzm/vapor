/**
 * Default event handler for error event.
 */
module.exports = function() {
    var log = this.log;

    log.warn('Disconnected from Steam network.');

    var error = new Error('Disconnected.');
    error.cause = 'disconnected';
    this.emit('error', error);
};
