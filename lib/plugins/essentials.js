/**
 * Automatically logs all major Steam events.
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
exports.name = 'essentials';

exports.plugin = function(VaporAPI) {

    var Steam = VaporAPI.getSteam();
    var steamFriends = VaporAPI.getHandler('steamFriends');

    var log = VaporAPI.getLogger();
    var utils = VaporAPI.getUtils();

    VaporAPI.registerHandler({emitter: 'steamFriends', event: 'friend'}, friend);
    VaporAPI.registerHandler({emitter: 'steamFriends', event: 'friendMsg'}, friendMsg);
    VaporAPI.registerHandler({emitter: 'steamFriends', event: 'group'}, group);
    VaporAPI.registerHandler({emitter: 'steamFriends', event: 'relationships'}, relationships);
    VaporAPI.registerHandler({emitter: 'steamUser', event: 'tradeOffers'}, tradeOffers);
    VaporAPI.registerHandler({emitter: 'steamTrading', event: 'tradeProposed'}, tradeProposed);

    function friend(user, type) {
        if(type === Steam.EFriendRelationship.RequestRecipient) {
            log.info('User %s added me.', user);
        } else if(type === Steam.EFriendRelationship.None) {
            log.info('User %s is no longer in my friends list.', utils.getUserDescription(user));
        }
    }

    function friendMsg(user, message, type) {
        if(type === Steam.EChatEntryType.ChatMsg) {
            log.info('%s says: %s', utils.getUserDescription(user), message);
        }
    }

    function group(groupID, type) {
        if(type === Steam.EClanRelationship.Invited) {
            log.info('I was invited to group: %s.', groupID);
        }
    }

    function relationships() {
        for(var user in steamFriends.friends) {
            if(steamFriends.friends[user] === Steam.EFriendRelationship.RequestRecipient) {
                log.info('New user (%s) added me while I was offline.', user);
            }
        }
    }

    function tradeOffers(number) {
        log.info('Number of trade offers has changed: %d', number);
    }

    function tradeProposed(tradeID, steamID) {
        log.info('I have received a trade request from: %s.', utils.getUserDescription(steamID));
    }

};
