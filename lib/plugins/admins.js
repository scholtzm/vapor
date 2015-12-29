/**
 * Provides whitelist-like functionality for recognizing admin accounts.
 *
 * This plugin replaces built-in admins system.
 * @example
 * bot.use(vapor.plugins.admins, ['7656123456789', '7656123789456']);
 *
 * // somewhere in your plugin
 * API.emitEvent('isAdmin', '7656123456789', function(result) {
 *   // result === true
 * });
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
exports.name = 'admins';

exports.plugin = function(VaporAPI) {
  var admins = VaporAPI.data;

  if(!admins) {
    throw new Error('Missing array of admin IDs.');
  }

  // Handle 'isAdmin' event
  VaporAPI.registerHandler({
    emitter: 'plugin',
    plugin: '*',
    event: 'isAdmin'
  }, function(steamID, callback) {
    callback(admins.indexOf(steamID) > -1);
  });
};
