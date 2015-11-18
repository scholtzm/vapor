var vapor = require('../../');

// Load sensitive data from ENV variables
var username = process.env.VAPOR_USER;
var password = process.env.VAPOR_PASS;

// Create our config object
var config = {
  username: username,
  password: password,
  displayName: 'Vapor Example - Custom Events 2'
};

// Create bot instance
var bot = vapor();

// Initialize bot with our config
bot.init(config);

// Use essential built-in plugins
// Logger is loaded first for obvious reasons
bot.use(vapor.plugins.consoleLogger);

// We load fs plugin right afterwards
// Some plugins may require `readFile` and `writeFile`
// event handler while loading
bot.use(vapor.plugins.fs);

bot.use(vapor.plugins.essentials);
bot.use(vapor.plugins.stdinSteamGuard);

// Create custom 'provider' plugin
bot.use({
  name: 'myProvider',
  plugin: function(VaporAPI) {
    // This plugin provides its own resource - simple string.
    // More complex scenarios could involve data from database or network.
    var internalResource = 'hello';

    VaporAPI.registerHandler({
      emitter: 'plugin',
      plugin: 'myConsumer',
      event: 'getValue'
    }, function(callback) {
      callback(internalResource);
    });
  }
});

// Create custom 'consumer' plugin
bot.use({
  name: 'myConsumer',
  plugin: function(VaporAPI) {
    var Steam = VaporAPI.getSteam();
    var steamFriends = VaporAPI.getHandler('steamFriends');

    VaporAPI.registerHandler({
      emitter: 'steamFriends',
      event: 'friendMsg'
    }, function(user, message, type) {
      if(type === Steam.EChatEntryType.ChatMsg) {
        if(message === 'hello') {
          VaporAPI.emitEvent('getValue', function(value) {
            steamFriends.sendMessage(user, value);
          });
        }
      }
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
