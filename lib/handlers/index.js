/**
 * Registers core handlers.
 * @param  {object} Vapor Vapor instance
 */
module.exports = function(Vapor) {
    Vapor.client.on('error', require('./error').bind(Vapor));
    Vapor.client.on('connected', require('./connected').bind(Vapor));
    Vapor.client.on('logOnResponse', require('./logOnResponse').bind(Vapor));
    Vapor.client.on('servers', require('./servers').bind(Vapor));
    Vapor.client.on('debug', require('./debug').bind(Vapor));
    Vapor.steamUser.on('updateMachineAuth', require('./updateMachineAuth').bind(Vapor));
};
