/**
 * Registering all handlers.
 * @param  {object} Vapor Vapor instance
 */
module.exports = function(Vapor) {
    /**
     * Handlers for the Steam client
     */
    // Misc
    Vapor.api.registerHandler('steam', 'error', require('./error').bind(Vapor));
    Vapor.api.registerHandler('steam', 'servers', require('./servers').bind(Vapor));
    Vapor.api.registerHandler('steam', 'sentry', require('./sentry').bind(Vapor));

    // Client related
    Vapor.api.registerHandler('steam', 'loggedOn', require('./loggedOn').bind(Vapor));
    Vapor.api.registerHandler('steam', 'friend', require('./friend').bind(Vapor));
    Vapor.api.registerHandler('steam', 'relationships', require('./relationships').bind(Vapor));
    Vapor.api.registerHandler('steam', 'friendMsg', require('./friendMsg').bind(Vapor));
    Vapor.api.registerHandler('steam', 'group', require('./group').bind(Vapor));


    // Trade related
    Vapor.api.registerHandler('steam', 'tradeOffers', require('./tradeOffers').bind(Vapor));
    Vapor.api.registerHandler('steam', 'webSessionID', require('./webSessionID').bind(Vapor));
    Vapor.api.registerHandler('steam', 'tradeProposed', require('./tradeProposed').bind(Vapor));
};
