var Steam = require('steam');

/**
 * Default event handler for friendMsg
 * @param  {string} user    User's SteamID.
 * @param  {string} message Message.
 * @param  {number} type    Message type.
 */
module.exports = function(user, message, type) {
    var log = this.log;
    var client = this.client;

    if(type === Steam.EChatEntryType.ChatMsg) {
        log.info(client.users[user].playerName + " (" + user + ") says: " + message);
    }
};
