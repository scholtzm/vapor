var fs = require('fs');
var Misc = require('../misc.js');

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
        sha_file: Misc.getSHA(message.bytes)
    });
};
