var vapor = require('../../');

// Load sensitive data from ENV variables
var username = process.env.VAPOR_USER;
var password = process.env.VAPOR_PASS;

// Create our config object
var config = {
    username: username,
    password: password,
    displayName: 'Vapor Example - Hello World'
};

// Create bot instance
var bot = vapor();

// 'fs' plugins saves the server list as './data/servers.json'
// We can try to use this file if it's available
try {
    bot.servers = require('./data/servers.json');
} catch(error) {
    // The file probably doesn't exist or cannot be parsed
}

// Initialize bot with our config
bot.init(config);

// Use essential built-in plugins
// Logger is loaded first for obvious reasons
bot.use(vapor.plugins.consoleLogger);
bot.use(vapor.plugins.essentials);
bot.use(vapor.plugins.stdinSteamGuard);
bot.use(vapor.plugins.fs);

// Use our custom 'hello-world' plugin
// We will use the provided VaporAPI argument
// It's not recommended to access Vapor instance directly
bot.use({
    name: 'hello-world',
    plugin: function(VaporAPI) {
        var Steam = VaporAPI.getSteam();
        var steamFriends = VaporAPI.getHandler('steamFriends');

        VaporAPI.registerHandler({
                emitter: 'steamFriends',
                event: 'friendMsg'
            },
            function(user, message, type) {
                if(type === Steam.EChatEntryType.ChatMsg) {
                    steamFriends.sendMessage(user, 'Hello World!');
                }
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
