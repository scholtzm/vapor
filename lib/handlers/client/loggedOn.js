/**
 * Default event handler for loggedOn event.
 */
module.exports = function() {
    var log = this.log;
    var displayName = this.config.displayName;
    var client = this.client;

    log.info(displayName + ' logged in successfully!');
    client.setPersonaState(Steam.EPersonaState.Online);
    client.setPersonaName(displayName);
};
