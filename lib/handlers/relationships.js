/**
 * Default event handler for relationships event.
 */
module.exports = function() {
    var log = this.log;
    var steamFriends = this.steamFriends;
    var Steam = this.Steam;

    for(var user in steamFriends.friends) {
        if(steamFriends.friends[user] === Steam.EFriendRelationship.RequestRecipient) {
            log.info('New user (' + user + ') added me while I was offline.');
        }
    }
};
