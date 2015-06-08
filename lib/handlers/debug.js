/**
 * Default event handler for debug event.
 * @param  {string} message Debug message.
 */
module.exports = function(message) {
    this.log.debug('Steam client debug: ' + message);
};
