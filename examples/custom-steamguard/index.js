var vapor = require('../../');

// Load sensitive data from ENV variables
var username = process.env.VAPOR_USER;
var password = process.env.VAPOR_PASS;

// Create our config object
var config = {
    username: username,
    password: password,
    displayName: 'Vapor Example - Custom SteamGuard',
    stdinSteamGuard: false // we need to set this to false
};

// Create bot instance
var bot = vapor();

// Initialize bot with our config
bot.init(config);

// Use essentials
bot.use(vapor.plugins.essentials);

// We want to use our custom code to retrieve SteamGuard code
bot.use({
    name: 'custom-steamguard',
    plugin: function(VaporAPI) {
        var log = VaporAPI.getLogger();

        // Register handler for `steamGuard` event
        VaporAPI.registerHandler({
                emitter: 'vapor',
                event: 'steamGuard'
            },
            function(callback) {
                // You need to retrieve the auth code somehow from your e-mail account
                // e.g. by using an IMAP module
                // Once you have the auth code, call the callback
                // In this example, I use a static code
                var code = '12345';
                log.info('Providing SteamGuard code %s.', code);

                // We will get disconnected after this call as expected
                // `error` event will be emitted afterwards
                callback(code);
            }
        );

        // Register handler for `error` event
        // This event will be fired since the SteamGuard code provided above is incorrect
        VaporAPI.registerHandler({
                emitter: 'vapor',
                event: 'error'
            },
            function(error) {
                log.error('Vapor error caught: %s', error.message);
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
