/**
 * Event handler for when our bot receives new sessionID.
 * @param sessionID
 */
module.exports = function(sessionID) {
    var log = this.log;
    var client = this.client;
    var tradeOffers = this.tradeOffers;

    log.info("Received new sessionID.");

    client.webLogOn(function(newCookie) {
        log.info("Received new cookie.");

        tradeOffers.setup({
        	sessionID: sessionID,
        	webCookie: newCookie
        });

        log.info("Trade offers have been enabled.");
    });
};
