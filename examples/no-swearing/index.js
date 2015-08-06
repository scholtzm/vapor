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
    admins: [ admin ]
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

// Use external plugin
// We optionally pass in data object which has property named config
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
