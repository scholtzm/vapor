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
    var utils = VaporAPI.getUtils();

    // Handle 'tradeProposed' event
    VaporAPI.registerHandler({
            emitter: 'steamTrading',
            event: 'tradeProposed'
        },
        function(tradeID, steamID) {
            steamTrading.respondToTrade(tradeID, false);

            log.info('I have declined a trade request from: %s.', utils.getUserDescription(steamID));
        }
    );

};
