/**
 * Event handler for client debug messages.
 */
module.exports = function(message) {
    var log = this.log;

    log.debug('Steam client debug: ' + message);
};
