/**
 * Logs account flags to console after successfully logging in.
 *
 * This plugin is mostly useful for debugging and development.
 * @example
 * bot.use(vapor.plugins.accountFlags);
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
exports.name = 'account-flags';

exports.plugin = function(VaporAPI) {
  var log = VaporAPI.getLogger();
  var Steam = VaporAPI.getSteam();

  // Handle 'logOnResponse' event
  VaporAPI.registerHandler({
    emitter: 'client',
    event: 'logOnResponse'
  }, function(response) {
    if(response.eresult === Steam.EResult.OK) {
      for(var flag in Steam.EAccountFlags) {
        var isSet = (response.account_flags & Steam.EAccountFlags[flag]) > 0;
        if(isSet) {
          log.info('Flag "%s" is set.', flag);
        }
      }
    }
  });
};
