/**
 * Sets display name and online state after logging in.
 *
 * This plugin accepts options object:
 * - `displayName` (string) - display name that will be used
 * - `state` (number|string) - online state that will be used;
 * if string is provided, this plugin will use `utils.stringToEnum`
 * to determine the enum value
 *
 * This plugin replaces init options 'displayName' and 'state'.
 * @example
 * bot.use(vapor.plugins.presence, {
 *   displayName: 'BananaBot',
 *   state: 'trade' // translates to 'Looking to Trade'
 * });
 *
 * // or
 *
 * bot.use(vapor.plugins.presence, {
 *   displayName: 'BananaBot',
 *   state: 1      // translates to 'Online'
 * });
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
exports.name = 'presence';

exports.plugin = function(VaporAPI) {
  var Steam = VaporAPI.getSteam();
  var steamFriends = VaporAPI.getHandler('steamFriends');
  var utils = VaporAPI.getUtils();
  var log = VaporAPI.getLogger();
  var config = VaporAPI.data;

  if(!config) {
    return;
  }

  // Handle 'logOnResponse' event
  VaporAPI.registerHandler({
    emitter: 'client',
    event: 'logOnResponse'
  }, function(response) {
    if(response.eresult === Steam.EResult.OK) {
      if(config.displayName) {
        log.info('Setting name to: %s.', config.displayName);
        steamFriends.setPersonaName(config.displayName);
      }

      var stateEnum = (typeof config.state === 'number')
        ? config.state
        : utils.stringToEnum(config.state, Steam.EPersonaState);

      if(stateEnum) {
        log.info('Setting state to: %s.', utils.enumToString(stateEnum, Steam.EPersonaState));
        steamFriends.setPersonaState(stateEnum);
      }
    }
  });
};
