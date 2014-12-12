var fs = require('fs');

/**
 * Event handler for when our bot receives new sentry file.
 * @param buffer Buffer.
 */

module.exports = function(buffer) {
    var sentryFile = this.sentryFile;
    var log        = this.log;

    log.info("Received new SteamGuard sentry file!");
    fs.writeFile(sentryFile, buffer);
};