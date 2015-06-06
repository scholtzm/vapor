/**
 * Register all event handlers.
 * @param Vapor Vapor instance.
 */
module.exports = function(Vapor) {
    /**
     * Handlers for the Steam client
     */
    // Misc
    Vapor.extension.registerHandler('steam', 'error', require('./client/error').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'servers', require('./client/servers').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'sentry', require('./client/sentry').bind(Vapor));

    // Client related
    Vapor.extension.registerHandler('steam', 'loggedOn', require('./client/loggedOn').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'friend', require('./client/friend').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'relationships', require('./client/relationships').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'friendMsg', require('./client/friendMsg').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'group', require('./client/group').bind(Vapor));


    // Trade related
    Vapor.extension.registerHandler('steam', 'tradeOffers', require('./client/tradeOffers').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'webSessionID', require('./client/webSessionID').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'tradeProposed', require('./client/tradeProposed').bind(Vapor));

    /**
     * Handlers for the trade offer module
     */
    Vapor.extension.registerHandler('steam-tradeoffers', 'debug', require('./offers/debug').bind(Vapor));
};
