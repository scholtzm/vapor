/**
 * Automatically declines all group invites.
 * 
 * Use this plugin if you don't want to deal with Steam group invites.
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
module.exports = function(VaporAPI) {

    var log = VaporAPI.getLogger();
    var client = VaporAPI.getClient();

    // Handle 'group' event
    VaporAPI.registerHandler({
            emitter: 'steam',
            event: 'group'
        }, 
        function(group, type) {
            if(type === Steam.EClanRelationship.Invited) {
                client.declineGroup(group);
                log.info('Invite to group (' + group + ') was automatically declined.');
            }
        }
    );

};
