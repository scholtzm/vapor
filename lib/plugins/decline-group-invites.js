/**
 * Automatically declines all group invites.
 *
 * Use this plugin if you don't want to deal with Steam group invites.
 * @example
 * bot.use(vapor.plugins.declineGroupInvites);
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
exports.name = 'decline-group-invites';

exports.plugin = function(VaporAPI) {
    var Steam = VaporAPI.getSteam();
    var steamGroups = VaporAPI.getHandler('steamGroups');
    var steamFriends = VaporAPI.getHandler('steamFriends');

    // Handle 'group' event
    VaporAPI.registerHandler({
            emitter: 'steamFriends',
            event: 'group'
        },
        function(group, type) {
            if(type === Steam.EClanRelationship.Invited) {
                steamGroups.acknowledgeGroupInvite(group, false);
                VaporAPI.emitEvent('message:info', 'Invite to group (' + group + ') was automatically declined.');
            }
        }
    );

    // Handle 'relationships' event
    VaporAPI.registerHandler({
            emitter: 'steamFriends',
            event: 'relationships'
        },
        function() {
            for(var group in steamFriends.groups) {
                if(steamFriends.groups[group] === Steam.EClanRelationship.Invited) {
                    steamGroups.acknowledgeGroupInvite(group, false);
                    VaporAPI.emitEvent('message:info', 'Invite to group (' + group + ') was automatically declined.');
                }
            }
        }
    );
};
