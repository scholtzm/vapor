/**
 * Default event handler for friendMsg event.
 * @param  {string} user    User's SteamID.
 * @param  {string} message Message.
 * @param  {number} type    Message type.
 */
module.exports = function(user, message, type) {
    var log = this.log;
    var steamFriends = this.steamFriends;
    var Steam = this.Steam;

    if(type === Steam.EChatEntryType.ChatMsg) {
        if(user in steamFriends.personaStates)
            log.info(steamFriends.personaStates[user].player_name + " (" + user + ") says: " + message);
        else
            log.info(user + " says: " + message);
    }
};
