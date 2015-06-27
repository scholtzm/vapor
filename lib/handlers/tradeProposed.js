/**
 * Default event handler for friend event.
 * @param  {string} tradeID Trade ID.
 * @param  {string} steamID User's Steam ID.
 */
module.exports = function(tradeID, steamID) {
    var client = this.client;
    var log = this.log;
    var config = this.config;

    log.info("I have received a trade request from " + client.users[steamID].playerName + " (" + steamID + ").");

    client.respondToTrade(tradeID, false);
    client.sendMessage(steamID, "Hey there. I don't accept trade requests. Please send me a trade offer. Thank you.");
    client.sendMessage(steamID, "My trade offer URL: " + config.tradeOfferURL);
};