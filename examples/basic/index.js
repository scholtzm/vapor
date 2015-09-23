var vapor = require('../../');

// Load sensitive data from ENV variables
var username = process.env.VAPOR_USER;
var password = process.env.VAPOR_PASS;

// Create our config object
var config = {
    username: username,
    password: password,
    displayName: 'Vapor Example - Basic',
    state: 'Online',
    admins: [],
    logs: {
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        consoleLevel: 'debug',
        fileLevel: 'debug',
        prefix: false
    }
};

// Create bot instance
var bot = vapor();

// Initialize bot with our config
bot.init(config);

// Use console-logger so there's actually some output
// We load this plugin as soon as possible so it can start logging ASAP
bot.use(vapor.plugins.consoleLogger);

// Use built-in plugin to easily enter SteamGuard code
bot.use(vapor.plugins.stdinSteamGuard);

// Start the bot
bot.connect();
