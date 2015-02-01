var Steam = require('steam');

/**
 * Event handler when someone invites our bot to a group.
 */
module.exports = function(group, type) {
    var log = this.log;
    var client = this.client;

    if(type === Steam.EClanRelationship.Invited) {
        log.info('I was invited to group: ' + group + '. Declining!');
        client.declineGroup(group);
    }
};
