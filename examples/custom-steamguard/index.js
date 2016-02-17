var vapor = require('../../');

// Load sensitive data from ENV variables
var username = process.env.VAPOR_USER;
var password = process.env.VAPOR_PASS;

// Create our config object
var config = {
  username: username,
  password: password,
  displayName: 'Vapor Example - Custom SteamGuard'
};

// Create bot instance
var bot = vapor();

// Initialize bot with our config
bot.init(config);

// Use couple built-in plugins
bot.use(vapor.plugins.consoleLogger);
bot.use(vapor.plugins.essentials);

// We want to use our custom code to retrieve SteamGuard code
bot.use({
  name: 'custom-steamguard',
  plugin: function(VaporAPI) {
    var log = VaporAPI.getLogger();

    // Register handler for `steamGuard` event
    VaporAPI.registerHandler({
      emitter: 'vapor',
      event: 'steamGuard'
    }, function(callback) {
      // You are most likely using 2FA with you bot account
      // In this case, you can just generate the code by using node-steam-totp or other module
      // This example provides dummy code on purpose
      var code = '12345';
      log.info('Providing SteamGuard code %s.', code);

      // We will get disconnected after this call and as a result
      // `disconnected` event will be emitted afterwards
      callback(code);
    });

    // Register handler for `disconnected` event
    // This event will be fired since the SteamGuard code provided above is incorrect
    VaporAPI.registerHandler({
      emitter: 'vapor',
      event: 'disconnected'
    }, function(error) {
      log.error('Vapor error caught: %s', error.message);
    });

  }
});

// Start the bot
bot.connect();

// Handle SIGINT (Ctrl+C) gracefully
process.on('SIGINT', function() {
  bot.disconnect();
  setTimeout(process.exit, 1000, 0);
});
