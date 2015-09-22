/**
 * Automatically declines all friend requests except for admins.
 *
 * Use this plugin if you don't want to deal with friends list.
 * @example
 * bot.use(vapor.plugins.declineFriendRequests);
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
exports.name = 'decline-friend-requests';

exports.plugin = function(VaporAPI) {
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
                    VaporAPI.emitEvent('message:info', 'Friend request from ' + user + ' (admin) has been automatically accepted.');
                } else {
                    steamFriends.removeFriend(user);
                    VaporAPI.emitEvent('message:info', 'Friend request from ' + user + ' has been automatically declined.');
                }
            }
        }
    );
};
