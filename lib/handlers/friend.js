/**
 * Default event handler for friend event.
 * @param  {string} user User's SteamID.
 * @param  {number} type Event type.
 */
module.exports = function(user, type) {
    var log = this.log;
    var steamFriends = this.steamFriends;
    var Steam = this.Steam;

    if(type === Steam.EFriendRelationship.RequestRecipient) {
        log.info('User ' + user + ' added me.');
    } else if(type === Steam.EFriendRelationship.None) {
        if(steamFriends.personaStates[user] !== undefined)
            log.info('User ' + steamFriends.personaStates[user].player_name + '(' + user + ') is no longer in my friends list.');
        else
            log.info('User ' + user + ' is no longer in my friends list.');
    }
};
