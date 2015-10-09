var vapor = require('../../');

// Load sensitive data from ENV variables
var username = process.env.VAPOR_USER;
var password = process.env.VAPOR_PASS;

// Create our config object
var config = {
    username: username,
    password: password,
    displayName: 'Vapor Example - Custom Events'
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

// Create custom 'emitter' plugin
bot.use({
    name: 'myEmitter',
    plugin: function(VaporAPI) {
        var Steam = VaporAPI.getSteam();

        VaporAPI.registerHandler({
                emitter: 'steamFriends',
                event: 'friendMsg'
            },
            function(user, message, type) {
                if(type === Steam.EChatEntryType.ChatMsg) {
                    VaporAPI.emitEvent('upperCasedFriendMessage', user, message.toUpperCase(), type);
                }
            }
        );
    }
});

// Create custom 'responder' plugin
bot.use({
    name: 'myResponder',
    plugin: function(VaporAPI) {
        var log = VaporAPI.getLogger();
        var utils = VaporAPI.getUtils();
        var Steam = VaporAPI.getSteam();

        VaporAPI.registerHandler({
                emitter: 'plugin',
                plugin: 'myEmitter',
                event: 'upperCasedFriendMessage'
            },
            function(user, message, type) {
                log.info('Received message from "myEmitter": %s', message);
                log.info('This message was originally sent by: %s', user);
                log.info('The message type is: %s', utils.enumToString(type, Steam.EChatEntryType));
            }
        );
    }
});

// Start the bot
bot.connect();

// Handle SIGINT (Ctrl+C) gracefully
process.on('SIGINT', function() {
    bot.disconnect();
    setTimeout(process.exit, 1000, 0);
});
