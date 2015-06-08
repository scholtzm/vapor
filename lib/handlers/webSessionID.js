/**
 * Default event handler for webSessionID event.
 * @param  {string} sessionID Valid session ID.
 */
module.exports = function(sessionID) {
    var vapor = this;
    var log = this.log;
    var client = this.client;

    log.info("Received new sessionID.");

    client.webLogOn(function(cookies) {
        log.info("Received new web cookies.");

        vapor.emit('cookies', cookies);
    });
};
