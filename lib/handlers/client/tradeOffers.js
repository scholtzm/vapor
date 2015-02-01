/**
 * Event handler for when the number of trade offers changes.
 * @param number Current number of trade offers.
 */
module.exports = function(number) {
    var log = this.log;

    log.info("Number of trade offers has changed: " + number);
};