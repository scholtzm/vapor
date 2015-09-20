var Misc = require('../misc.js');

/**
 * Default event handler for updateMachineAuth event.
 * @param {CMsgClientUpdateMachineAuth} message Message.
 * @param {function} callback Callback function.
 */
module.exports = function(message, callback) {
    this.log.info('Received new SteamGuard sentry file.');
    this.emit('writeFile', this.sentryFile, message.bytes);

    callback({
        sha_file: Misc.getSHA(message.bytes)
    });
};
