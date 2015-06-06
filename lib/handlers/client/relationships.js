/**
 * Event handler when someone adds or removes our bot.
 */
module.exports = function() {
    var log = this.log;
    var client = this.client;
    var Steam = this.Steam;

    for(var user in client.friends) {
        if(client.friends[user] === Steam.EFriendRelationship.RequestRecipient) {
            log.info('New user (' + user + ') added me while I was offline!');
        }
    }
};
