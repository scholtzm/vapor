/**
 * Automatically declines all trade requests.
 *
 * Use this plugin if you don't want to deal with regular trading system.
 *
 * **Remark:** This plugin does not decline trade offers.
 * @example
 * bot.use(vapor.plugins.declineTradeRequests);
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
exports.name = 'decline-trade-requests';

exports.plugin = function(VaporAPI) {
    var steamTrading = VaporAPI.getHandler('steamTrading');
    var utils = VaporAPI.getUtils();

    // Handle 'tradeProposed' event
    VaporAPI.registerHandler({
            emitter: 'steamTrading',
            event: 'tradeProposed'
        },
        function(tradeID, steamID) {
            steamTrading.respondToTrade(tradeID, false);

            VaporAPI.emitEvent('message:info', 'Trade request from ' + utils.getUserDescription(steamID) + ' has been declined.');
        }
    );
};
