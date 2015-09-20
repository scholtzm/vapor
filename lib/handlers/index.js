/**
 * Register core handlers.
 * @param  {object} Vapor Vapor instance
 */
module.exports = function(Vapor) {
    Vapor._client.on('error', require('./error').bind(Vapor));
    Vapor._client.on('connected', require('./connected').bind(Vapor));
    Vapor._client.on('logOnResponse', require('./logOnResponse').bind(Vapor));
    Vapor._client.on('servers', require('./servers').bind(Vapor));
    Vapor._client.on('debug', require('./debug').bind(Vapor));
    Vapor._steamUser.on('updateMachineAuth', require('./updateMachineAuth').bind(Vapor));
};
