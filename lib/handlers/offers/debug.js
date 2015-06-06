/**
 * Event handler for trade offers debug messages.
 */
module.exports = function(message) {
    var log = this.log;

    log.debug('Trade Offers debug: ' + message);
};
