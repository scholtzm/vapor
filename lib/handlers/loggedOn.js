/**
 * Default event handler for loggedOn event.
 */
module.exports = function() {
    var Steam = this.Steam;
    var log = this.log;
    var client = this.client;

    var displayName = this.config.displayName || "Vapor Bot";
    var onlineState = this.config.onlineState || Steam.EPersonaState.Online;

    delete this.config.password;

    log.info(displayName + ' logged in successfully.');
    client.setPersonaState(onlineState);
    client.setPersonaName(displayName);
};
