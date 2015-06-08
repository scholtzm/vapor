/**
 * Default event handler for tradeOffers event.
 * @param  {number} number Number of pending trade offers.
 */
module.exports = function(number) {
    this.log.info("Number of trade offers has changed: " + number);
};
