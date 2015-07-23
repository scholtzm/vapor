/**
 * Automatically declines all trade requests.
 *
 * Use this plugin if you don't want to deal with regular trading system.
 *
 * **Remark:** This plugin does not decline trade offers.
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
module.exports = function(VaporAPI) {

    var log = VaporAPI.getLogger();
    var steamTrading = VaporAPI.getHandler('steamTrading');
    var steamFriends = VaporAPI.getHandler('steamFriends');

    // Handle 'tradeProposed' event
    VaporAPI.registerHandler({
            emitter: 'steamTrading',
            event: 'tradeProposed'
        },
        function(tradeID, steamID) {
            steamTrading.respondToTrade(tradeID, false);

            if(steamID in steamFriends.personaStates)
                log.info("I have declined a trade request from: " + steamFriends.personaStates[steamID].player_name + " (" + steamID + ").");
            else
                log.info("I have declined a trade request from: " + steamID + ".");
        }
    );

};
