/**
 * Default event handler for friend event.
 * @param  {string} user User's SteamID.
 * @param  {number} type Event type.
 */
module.exports = function(user, type) {
    var log = this.log;
    var Steam = this.Steam;
    var utils = this.utils;

    if(type === Steam.EFriendRelationship.RequestRecipient) {
        log.info('User ' + user + ' added me.');
    } else if(type === Steam.EFriendRelationship.None) {
        log.info('User ' + utils.getUserDescription(user) + ' is no longer in my friends list.');
    }
};
