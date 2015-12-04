/**
 * Automatically responds to any chat message with a predefined response.
 *
 * Response is required to load this plugin.
 * @example
 * bot.use(vapor.plugins.autoResponder, 'Response chat message.');
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
exports.name = 'auto-responder';

exports.plugin = function(VaporAPI) {
  var Steam = VaporAPI.getSteam();
  var steamFriends = VaporAPI.getHandler('steamFriends');
  var response = VaporAPI.data;

  if(typeof response !== 'string') {
    throw new Error('Missing response. Plugin cannot be loaded.');
  }

  // Handle 'friendMsg' event
  VaporAPI.registerHandler({
    emitter: 'steamFriends',
    event: 'friendMsg'
  }, function(user, message, type) {
    if(type === Steam.EChatEntryType.ChatMsg) {
      steamFriends.sendMessage(user, response);
    }
  });
};
