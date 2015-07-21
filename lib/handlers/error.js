/**
 * Default event handler for error event.
 */
module.exports = function() {
    var client = this.client;
    var log = this.log;

    log.warn("Disconnected from Steam network. Retrying in 5 seconds ...");

    // Let's attempt to reconnect again in 5 seconds.
    setTimeout(function() {
        client.connect();
    }, 5000);
};
