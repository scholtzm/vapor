var Steam = require('steam');

/**
 * Event handler when someone adds or removes our bot.
 */
module.exports = function() {
    var log = this.log;
    var client = this.client;

    for(var user in client.friends) {
        if(client.friends[user] === Steam.EFriendRelationship.PendingInvitee) {
            log.info('New user (' + user + ') added me while I was offline!');
            client.addFriend(user);
        }
    }
};
