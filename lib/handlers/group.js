/**
 * Default event handler for group event.
 * @param  {string} group Group ID.
 * @param  {number} type  Relationship type.
 */
module.exports = function(group, type) {
    var log = this.log;
    var Steam = this.Steam;

    if(type === Steam.EClanRelationship.Invited) {
        log.info("I was invited to group: " + group + ".");
    }
};
