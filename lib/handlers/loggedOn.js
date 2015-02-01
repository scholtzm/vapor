var Steam = require('steam');

/**
 * Event handler for when our bot logs in.
 */
module.exports = function() {
    var log = this.log;
    var displayName = this.config.displayName;
    var client = this.client;

    log.info(displayName + ' logged in successfully!');
    client.setPersonaState(Steam.EPersonaState.Online);
    client.setPersonaName(displayName);
};
