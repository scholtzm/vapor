var vapor = require('../../');
var noSwearing = require('./no-swearing-plugin.js');

// Load sensitive data from ENV variables
var username = process.env.VAPOR_USER;
var password = process.env.VAPOR_PASS;
var admin = process.env.VAPOR_ADMIN;

// Create our config object
var config = {
    username: username,
    password: password,
    displayName: 'Vapor Example - No Swearing',
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
bot.use(vapor.plugins.essentials);

// Use other built-in plugins
bot.use(vapor.plugins.declineFriendRequests);
bot.use(vapor.plugins.declineGroupInvites);
bot.use(vapor.plugins.declineTradeRequests);
bot.use(vapor.plugins.offlineMessages);

// Use external plugin and pass in config
bot.use(noSwearing, {config: {
    words: ['cow', 'pig', 'rat'], // ... etc., you get the idea.
    action: 'warning'
}});

// Start the bot
bot.connect();

// Handle SIGINT (Ctrl+C) gracefully
process.on('SIGINT', function() {
    bot.disconnect();
    setTimeout(process.exit, 1000, 0);
});
