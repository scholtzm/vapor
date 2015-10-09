var vapor = require('../../');

// Load sensitive data from ENV variables
var username = process.env.VAPOR_USER;
var password = process.env.VAPOR_PASS;

// Create our config object
var config = {
    username: username,
    password: password,
    displayName: 'Vapor Example - Ext. Handlers'
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

// Create custom plugin
bot.use({
    name: 'my-csgo-plugin',
    plugin: function(VaporAPI) {
        var Steam = VaporAPI.getSteam();
        var client = VaporAPI.getClient();

        // Instantiate GC for CS:GO (appid = 730)
        var steamGameCoordinator = new Steam.SteamGameCoordinator(client, 730);

        // Do something with steamGameCoordinator
        steamGameCoordinator.on('message', function() {
            // You get the idea ...
        });

        // You could also further use 'node-csgo' or similar module.
    }
});

// Start the bot
bot.connect();

// Handle SIGINT (Ctrl+C) gracefully
process.on('SIGINT', function() {
    bot.disconnect();
    setTimeout(process.exit, 1000, 0);
});
