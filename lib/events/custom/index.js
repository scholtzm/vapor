/**
 * Register message handlers.
 * @param  {object} Vapor Vapor instance
 */
module.exports = function(Vapor) {
  Vapor._client.on('message', require('./ClientNewLoginKey.js').bind(Vapor));
};
