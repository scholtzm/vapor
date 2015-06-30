module.exports = function(VaporAPI) {

    var log = VaporAPI.getLogger();
    var client = VaporAPI.getClient();

    // Handle 'group' event
    VaporAPI.registerHandler({
        emitter: 'steam',
        event: 'group', 
        callback: function(group, type) {
            if(type === Steam.EClanRelationship.Invited) {
                client.declineGroup(group);
                log.info('Invite to group (' + group + ') was automatically declined.');
            }
        }
    });

};
