/**
 * Default event handler for friend event.
 * @param  {string} tradeID Trade ID.
 * @param  {string} steamID User's Steam ID.
 */
module.exports = function(tradeID, steamID) {
    var steamFriends = this.steamFriends;
    var log = this.log;

    if(steamFriends.personaStates[steamID] !== undefined)
        log.info("I have received a trade request from: " + steamFriends.personaStates[steamID].player_name + " (" + steamID + ").");
    else
        log.info("I have received a trade request from: " + steamID + ".");
};
