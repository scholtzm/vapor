var fs = require('fs');
var crypto = require('crypto');

/**
 * Default event handler for updateMachineAuth event.
 * @param {CMsgClientUpdateMachineAuth} message Message.
 * @param {function} callback Callback function.
 */
module.exports = function(message, callback) {
    var sentry = this.sentryFilePath;
    var log = this.log;

    log.info('Received new SteamGuard sentry file.');

    fs.writeFileSync(sentry, message.bytes);

    callback({
        sha_file: crypto.createHash('sha1').update(message.bytes).digest()
    });
};
