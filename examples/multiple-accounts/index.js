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
        var bot = VaporAPI.data.bot;

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

// Use essentials
bot1.use(vapor.plugins.essentials);
bot2.use(vapor.plugins.essentials);

// Use our chain loader plugin
bot1.use(chainLoader, {bot: bot2});

// Start the chain
bot1.connect();

// Handle SIGINT (Ctrl+C) gracefully
process.on('SIGINT', function() {
    bot1.disconnect();
    bot2.disconnect();
    setTimeout(process.exit, 1000, 0);
});
