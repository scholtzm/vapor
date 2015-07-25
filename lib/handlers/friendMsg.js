/**
 * Default event handler for friendMsg event.
 * @param  {string} user    User's SteamID.
 * @param  {string} message Message.
 * @param  {number} type    Message type.
 */
module.exports = function(user, message, type) {
    var log = this.log;
    var Steam = this.Steam;
    var utils = this.utils;

    if(type === Steam.EChatEntryType.ChatMsg) {
        log.info(utils.getUserDescription(user) + " says: " + message);
    }
};
