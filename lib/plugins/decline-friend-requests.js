/**
 * Automatically declines all friend requests except for admins.
 *
 * Use this plugin if you don't want to deal with friends list.
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
module.exports = function(VaporAPI) {

    var log = VaporAPI.getLogger();
    var utils = VaporAPI.getUtils();
    var Steam = VaporAPI.getSteam();
    var steamFriends = VaporAPI.getHandler('steamFriends');

    // Handle 'friend' event
    VaporAPI.registerHandler({
            emitter: 'steamFriends',
            event: 'friend'
        },
        function(user, type) {
            if(type === Steam.EFriendRelationship.RequestRecipient) {
                if(utils.isAdmin(user)) {
                    steamFriends.addFriend(user);
                    log.info("Friend request from " + user + " (admin) has been automatically accepted.");
                } else {
                    steamFriends.removeFriend(user);
                    log.info("Friend request from " + user + " has been automatically declined.");
                }
            }
        }
    );

};
