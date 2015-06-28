/**
 * Default event handler for friend event.
 * @param  {string} tradeID Trade ID.
 * @param  {string} steamID User's Steam ID.
 */
module.exports = function(tradeID, steamID) {
    var client = this.client;
    var log = this.log;
    var config = this.config;

    if(client.users[steamID] !== undefined)
        log.info("I have received a trade request from: " + client.users[steamID].playerName + " (" + steamID + ").");
    else
        log.info("I have received a trade request from: " + steamID + ".");
};
