var vapor = require('../../');

// Load sensitive data from ENV variables
var username1 = process.env.VAPOR_USER1;
var password1 = process.env.VAPOR_PASS1;

var username2 = process.env.VAPOR_USER2;
var password2 = process.env.VAPOR_PASS2;

// Create our config objects
var config1 = {
    username: username1,
    password: password1,
    displayName: 'Vapor Example - Instance 1',
    logs: {prefix: true}
};

var config2 = {
    username: username2,
    password: password2,
    displayName: 'Vapor Example - Instance 2',
    logs: {prefix: true}
};

// This plugin allows our bots to start in chain
var chainLoader = {
    name: 'chain-loader',
    plugin: function(VaporAPI) {
        var log = VaporAPI.getLogger();
        // The bot instance will be passed into `Vapor.use` method.
        var bot = VaporAPI.data;

        VaporAPI.registerHandler({
                emitter: 'vapor',
                event: 'ready'
            },
            function() {
                log.info('Starting another bot instance.');
                bot.connect();
            }
        );
    }
};

// Create bot instances
var bot1 = vapor();
var bot2 = vapor();

// Initialize bots with our configs
bot1.init(config1);
bot2.init(config2);

// Use essential built-in plugins
bot1.use(vapor.plugins.essentials);
bot1.use(vapor.plugins.stdinSteamGuard);
bot1.use(vapor.plugins.fs, './data1');

bot2.use(vapor.plugins.essentials);
bot2.use(vapor.plugins.stdinSteamGuard);
bot2.use(vapor.plugins.fs, './data2');

// Use our chain loader plugin
// We pass in `bot2` as data argument
bot1.use(chainLoader, bot2);

// Start the chain
bot1.connect();

// Handle SIGINT (Ctrl+C) gracefully
process.on('SIGINT', function() {
    bot1.disconnect();
    bot2.disconnect();
    setTimeout(process.exit, 1000, 0);
});
