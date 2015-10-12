/**
 * Reads SteamGuard auth code from the standard input.
 * @example
 * bot.use(vapor.plugins.stdinSteamGuard);
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
var readline = require('readline');

exports.name = 'stdin-steamguard';

exports.plugin = function(VaporAPI) {
  // Handle 'steamGuard' event
  VaporAPI.registerHandler({
    emitter: 'vapor',
    event: 'steamGuard'
  }, function(callback) {
    var rl = readline.createInterface({
      'input': process.stdin,
      'output': process.stdout
    });

    rl.question('Please enter the SteamGuard code: ', function(code) {
      rl.close();
      callback(code);
    });
  });
};
