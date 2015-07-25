/**
 * Default event handler for friend event.
 * @param  {string} tradeID Trade ID.
 * @param  {string} steamID User's Steam ID.
 */
module.exports = function(tradeID, steamID) {
    var log = this.log;
    var utils = this.utils;

    log.info("I have received a trade request from: " + utils.getUserDescription(steamID) + ".");
};
