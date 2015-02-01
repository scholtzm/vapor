var Steam = require('steam');

/**
 * Event handler when someone adds or removes our bot.
 */
module.exports = function(user, type) {
    var log = this.log;
    var client = this.client;

    if(type === Steam.EFriendRelationship.PendingInvitee) {
    	log.info('New user (' + user + ') added me!');
    	client.addFriend(user);

    } else if(type === Steam.EFriendRelationship.None) {
    	log.info('User ' + client.users[user].playerName + '(' + user + ') removed me!');
    }
};
