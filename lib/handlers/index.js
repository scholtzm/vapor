/**
 * Registers all handlers.
 * @param  {object} Vapor Vapor instance
 */
module.exports = function(Vapor) {

    // Client related
    Vapor.client.on('error', require('./error').bind(Vapor));
    Vapor.client.on('connected', require('./connected').bind(Vapor));
    Vapor.client.on('logOnResponse', require('./logOnResponse').bind(Vapor));
    Vapor.client.on('servers', require('./servers').bind(Vapor));
    Vapor.client.on('debug', require('./debug').bind(Vapor));

    // SteamUser events
    Vapor.steamUser.on('tradeOffers', require('./tradeOffers').bind(Vapor));
    Vapor.steamUser.on('updateMachineAuth', require('./updateMachineAuth').bind(Vapor));

    // SteamFriends events
    Vapor.steamFriends.on('friend', require('./friend').bind(Vapor));
    Vapor.steamFriends.on('relationships', require('./relationships').bind(Vapor));
    Vapor.steamFriends.on('friendMsg', require('./friendMsg').bind(Vapor));
    Vapor.steamFriends.on('group', require('./group').bind(Vapor));

    // SteamTrading events
    Vapor.steamTrading.on('tradeProposed', require('./tradeProposed').bind(Vapor));

};
