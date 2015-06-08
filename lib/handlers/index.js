/**
 * Register all event handlers.
 * @param Vapor Vapor instance.
 */
module.exports = function(Vapor) {
    /**
     * Handlers for the Steam client
     */
    // Misc
    Vapor.extension.registerHandler('steam', 'error', require('./error').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'servers', require('./servers').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'sentry', require('./sentry').bind(Vapor));

    // Client related
    Vapor.extension.registerHandler('steam', 'loggedOn', require('./loggedOn').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'friend', require('./friend').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'relationships', require('./relationships').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'friendMsg', require('./friendMsg').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'group', require('./group').bind(Vapor));


    // Trade related
    Vapor.extension.registerHandler('steam', 'tradeOffers', require('./tradeOffers').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'webSessionID', require('./webSessionID').bind(Vapor));
    Vapor.extension.registerHandler('steam', 'tradeProposed', require('./tradeProposed').bind(Vapor));
};
