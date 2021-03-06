/**
 * Register core event handlers.
 * @param  {object} Vapor Vapor instance
 */
module.exports = function(Vapor) {
  Vapor._client.on('error', require('./error').bind(Vapor));
  Vapor._client.on('connected', require('./connected').bind(Vapor));
  Vapor._client.on('logOnResponse', require('./logOnResponse').bind(Vapor));
  Vapor._client.on('servers', require('./servers').bind(Vapor));
  Vapor._steamUser.on('updateMachineAuth', require('./updateMachineAuth').bind(Vapor));

  // custom event handlers for Steam messages which are not handled by node-steam itself
  require('./custom')(Vapor);
};
