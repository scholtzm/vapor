var fs = require('fs');

/**
 * Event handler for when our bot receives new sentry file.
 * @param buffer Buffer.
 */

module.exports = function(buffer) {
    var sentryFile = this.sentryFile;
    var log = this.log;
    var config = this.config;

    log.info("Received new SteamGuard sentry file!");

    var sentryFileDir = sentryFile.replace(config.username + '.sentry', '');
    if(!fs.existsSync(sentryFileDir)) {
        fs.mkdirSync(sentryFileDir);
    }

    fs.writeFileSync(sentryFile, buffer);
};
