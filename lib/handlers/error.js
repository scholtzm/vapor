/**
 * Default event handler for error event.
 * @param  {object} error Error object.
 */
module.exports = function() {
    var client = this.client;

    // Let's attempt to reconnect again in 10 seconds.
    setTimeout(function() {
        client.connect();
    }, 10000);
};
