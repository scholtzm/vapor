/**
 * Automatically logs all major Steam events.
 * @example
 * bot.use(vapor.plugins.essentials);
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
var util = require('util');

exports.name = 'essentials';

exports.plugin = function(VaporAPI) {

    var Steam = VaporAPI.getSteam();
    var steamFriends = VaporAPI.getHandler('steamFriends');
    var utils = VaporAPI.getUtils();

    VaporAPI.registerHandler({emitter: 'steamFriends', event: 'friend'}, friend);
    VaporAPI.registerHandler({emitter: 'steamFriends', event: 'friendMsg'}, friendMsg);
    VaporAPI.registerHandler({emitter: 'steamFriends', event: 'group'}, group);
    VaporAPI.registerHandler({emitter: 'steamFriends', event: 'relationships'}, relationships);
    VaporAPI.registerHandler({emitter: 'steamUser', event: 'tradeOffers'}, tradeOffers);
    VaporAPI.registerHandler({emitter: 'steamTrading', event: 'tradeProposed'}, tradeProposed);

    function emitInfo() {
        var messageText = util.format.apply(util.format, arguments);
        VaporAPI.emitEvent('message:info', messageText);
    }

    function friend(user, type) {
        if(type === Steam.EFriendRelationship.RequestRecipient) {
            emitInfo('User %s added me.', user);
        } else if(type === Steam.EFriendRelationship.None) {
            emitInfo('User %s is no longer in my friends list.', utils.getUserDescription(user));
        }
    }

    function friendMsg(user, message, type) {
        if(type === Steam.EChatEntryType.ChatMsg) {
            emitInfo('%s says: %s', utils.getUserDescription(user), message);
        }
    }

    function group(groupID, type) {
        if(type === Steam.EClanRelationship.Invited) {
            emitInfo('I was invited to group: %s.', groupID);
        }
    }

    function relationships() {
        for(var user in steamFriends.friends) {
            if(steamFriends.friends[user] === Steam.EFriendRelationship.RequestRecipient) {
                emitInfo('New user (%s) added me while I was offline.', user);
            }
        }
    }

    function tradeOffers(number) {
        emitInfo('Number of trade offers has changed: %d', number);
    }

    function tradeProposed(tradeID, steamID) {
        emitInfo('I have received a trade request from: %s.', utils.getUserDescription(steamID));
    }

};
