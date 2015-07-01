/**
 * Automatically declines all friend requests except for admins.
 * Use this plugin if you don't want to deal with friends list.
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
module.exports = function(VaporAPI) {

    var log = VaporAPI.getLogger();
    var client = VaporAPI.getClient();
    var utils = VaporAPI.getUtils();
    var Steam = VaporAPI.getSteam();

    // Handle 'friend' event
    VaporAPI.registerHandler({
        emitter: 'steam',
        event: 'friend',
        callback: function(user, type) {
            if(type === Steam.EFriendRelationship.RequestRecipient) {
                if(utils.isAdmin(user)) {
                    client.addFriend(user);
                    log.info('Friend request from ' + user + ' (admin) was automatically accepted.');
                } else {
                    client.removeFriend(friend);
                    log.info('Friend request from ' + user + ' was automatically declined.');
                }
            }
        }
    });

};
