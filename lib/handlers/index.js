/**
 * Register all event handlers.
 * @param Vapor Vapor instance.
 */
module.exports = function(Vapor) {
    // Misc
    Vapor.client.on('error', require('./error').bind(Vapor));
    Vapor.client.on('servers', require('./servers').bind(Vapor));
    Vapor.client.on('sentry', require('./sentry').bind(Vapor));

    // Client related
    Vapor.client.on('loggedOn', require('./loggedOn').bind(Vapor));
    Vapor.client.on('friendMsg', require('./friendMsg').bind(Vapor));

    // Trade related
    Vapor.client.on('tradeOffers', require('./tradeOffers').bind(Vapor));
    Vapor.client.on('webSessionID', require('./webSessionID').bind(Vapor));
    Vapor.client.on('tradeProposed', require('./tradeProposed').bind(Vapor));
};