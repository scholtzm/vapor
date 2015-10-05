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
bot.use(vapor.plugins.essentials);
bot.use(vapor.plugins.stdinSteamGuard);
bot.use(vapor.plugins.fs);

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
        var utils = VaporAPI.getUtils();
        var Steam = VaporAPI.getSteam();

        VaporAPI.registerHandler({
                emitter: 'plugin',
                plugin: 'myEmitter',
                event: 'upperCasedFriendMessage'
            },
            function(user, message, type) {
                VaporAPI.emitEvent('message:info', 'Received message from "myEmitter": ' + message);
                VaporAPI.emitEvent('message:info', 'This message was originally sent by: ' + user);
                VaporAPI.emitEvent('message:info', 'The message type is: ' + utils.enumToString(type, Steam.EChatEntryType));
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
