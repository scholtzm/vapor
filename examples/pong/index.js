var vapor = require('../../');

// Load sensitive data from ENV variables
var username = process.env.VAPOR_USER;
var password = process.env.VAPOR_PASS;
var admin = process.env.VAPOR_ADMIN;

// Create our config object
var config = {
    username: username,
    password: password,
    displayName: 'Vapor Example - Pong',
    state: 'Online',
    admins: [ admin ],
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
bot.use('essentials', vapor.plugins.essentials);

// Use our custom 'pong' plugin
bot.use('pong', function(VaporAPI) {
    var Steam = VaporAPI.getSteam();
    var steamFriends = VaporAPI.getHandler('steamFriends');

    VaporAPI.registerHandler({
            emitter: 'steamFriends',
            event: 'friendMsg'
        },
        function(user, message, type) {
            if(type === Steam.EChatEntryType.ChatMsg) {
                if(message === 'ping') {
                    steamFriends.sendMessage(user, 'pong');
                }
            }
        }
    );
});

// Start the bot
bot.connect();

// Handle SIGINT (Ctrl+C) gracefully
process.on('SIGINT', function() {
    bot.disconnect();
    setTimeout(process.exit, 1000, 0);
});
