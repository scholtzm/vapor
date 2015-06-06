var Steam = require('steam');

/**
 * Defualt event handler for friend event.
 * @param  {string} user User's SteamID.
 * @param  {number} type Event type.
 */
module.exports = function(user, type) {
    var log = this.log;
    var client = this.client;

    if(type === Steam.EFriendRelationship.PendingInvitee) {
        log.info('User (' + user + ') added me!');
    } else if(type === Steam.EFriendRelationship.None) {
        log.info('User ' + client.users[user].playerName + '(' + user + ') removed me!');
    }
};
