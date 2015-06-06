/**
 * Defualt event handler for friend event.
 * @param  {string} user User's SteamID.
 * @param  {number} type Event type.
 */
module.exports = function(user, type) {
    var log = this.log;
    var client = this.client;
    var Steam = this.Steam;

    if(type === Steam.EFriendRelationship.RequestRecipient) {
        log.info('User (' + user + ') added me!');
    } else if(type === Steam.EFriendRelationship.None) {
        if(client.users[user] !== undefined)
            log.info('User ' + client.users[user].playerName + '(' + user + ') removed me!');
        else
            log.info('User (' + user + ') removed me!');
    }
};
