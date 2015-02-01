/**
 * Register all event handlers.
 * @param Vapor Vapor instance.
 */
module.exports = function(Vapor) {
    /**
     * Handlers for the Steam client
     */
    // Misc
    Vapor.client.on('error', require('./client/error').bind(Vapor));
    Vapor.client.on('servers', require('./client/servers').bind(Vapor));
    Vapor.client.on('sentry', require('./client/sentry').bind(Vapor));

    // Client related
    Vapor.client.on('loggedOn', require('./client/loggedOn').bind(Vapor));
    Vapor.client.on('friend', require('./client/friend').bind(Vapor));
    Vapor.client.on('relationships', require('./client/relationships').bind(Vapor));
    Vapor.client.on('friendMsg', require('./client/friendMsg').bind(Vapor));
    Vapor.client.on('group', require('./client/group').bind(Vapor));

    // Trade related
    Vapor.client.on('tradeOffers', require('./client/tradeOffers').bind(Vapor));
    Vapor.client.on('webSessionID', require('./client/webSessionID').bind(Vapor));
    Vapor.client.on('tradeProposed', require('./client/tradeProposed').bind(Vapor));

    /**
     * Handlers for the trade offer module
     */
    Vapor.tradeOffers.on('debug', require('./offers/debug.js').bind(Vapor));
};
