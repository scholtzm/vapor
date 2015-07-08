var Utils = require('../utils.js');

/**
 * Default event handler for loggedOn event.
 */
module.exports = function() {
    var Steam = this.Steam;
    var log = this.log;
    var client = this.client;

    var utils = new Utils(this);
    var onlineState = utils.stringToEnum(this.config.state, Steam.EPersonaState);

    if(onlineState === null) {
        log.warn("State value '" + this.config.state + "' in your config is set incorrectly.");
        log.warn("Defaulting to: Online");

        onlineState = Steam.EPersonaState.Online;
    }

    var displayName = this.config.displayName || "Vapor Bot";

    log.info(displayName + " logged in successfully.");
    client.setPersonaState(onlineState);
    client.setPersonaName(displayName);
};
