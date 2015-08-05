var vapor = require('../../');

// Load sensitive data from ENV variables
var username = process.env.VAPOR_USER;
var password = process.env.VAPOR_PASS;

// Create our config object
var config = {
    username: username,
    password: password,
    displayName: 'Vapor Example - Custom Events',
    state: 'Online',
    admins: [],
    logs: {
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        consoleLevel: 'debug',
        fileLevel: 'debug'
    },
    dataDir: './data'
};

// Create bot instance
var bot = vapor();

// Initialize bot with our config
bot.init(config);

// Use essentials
bot.use(vapor.plugins.essentials);

// Use other built-in plugins
bot.use(vapor.plugins.declineFriendRequests);
bot.use(vapor.plugins.declineGroupInvites);
bot.use(vapor.plugins.declineTradeRequests);
bot.use(vapor.plugins.offlineMessages);

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
