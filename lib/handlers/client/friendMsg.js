/**
 * Default event handler for friendMsg event.
 * @param  {string} user    User's SteamID.
 * @param  {string} message Message.
 * @param  {number} type    Message type.
 */
module.exports = function(user, message, type) {
    var log = this.log;
    var client = this.client;
    var Steam = this.Steam;

    if(type === Steam.EChatEntryType.ChatMsg) {
        if(client.users[user] !== undefined)
            log.info(client.users[user].playerName + " (" + user + ") says: " + message);
        else
            log.info(user + " says: " + message);
    }
};
