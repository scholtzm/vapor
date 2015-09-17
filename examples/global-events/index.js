var vapor = require('../../');

// Load sensitive data from ENV variables
var username = process.env.VAPOR_USER;
var password = process.env.VAPOR_PASS;

// Create our config object
var config = {
    username: username,
    password: password,
    displayName: 'Vapor Example - Global Events',
    logs: {
        // Make sure debug level is enabled since
        // that's what we use for logging in this example
        consoleLevel: 'debug',
        fileLevel: 'debug'
    }
};

// Create bot instance
var bot = vapor();

// Initialize bot with our config
bot.init(config);

// Use essential built-in plugins
bot.use(vapor.plugins.essentials);
bot.use(vapor.plugins.stdinSteamGuard);

// Create dummy plugin which will re-emit all chat messages as 'debug' events
// This is simply for demonstration purposes
bot.use({
    name: 'custom-emitter',
    plugin: function(VaporAPI) {
        var Steam = VaporAPI.getSteam();

        VaporAPI.registerHandler({
                emitter: 'steamFriends',
                event: 'friendMsg'
            },
            function(user, message, type) {
                if(type === Steam.EChatEntryType.ChatMsg) {
                    VaporAPI.emitEvent('debug', 'Received message from ' + user);
                }
            }
        );
    }
});

// This plugin will intercept all 'debug' events emitted by
// any emitter and log them
// e.g. events by 'node-steam' or 'custom-emitter'
bot.use({
    name: 'global-events',
    plugin: function(VaporAPI) {
        var log = VaporAPI.getLogger();

        VaporAPI.registerHandler({
                emitter: '*',
                event: 'debug'
            },
            function() {
                log.debug(Array.prototype.join.call(arguments, ', '));
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
