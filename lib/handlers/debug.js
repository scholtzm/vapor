/**
 * Default event handler for debug event.
 * @param  {string} message Debug message.
 */
module.exports = function(message) {
    this.log.verbose('Steam client debug: %s', message);
};
