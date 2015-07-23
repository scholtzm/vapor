var prompt = require('prompt');
var Utils = require('../utils.js');

/**
 * Default event handler for logOnResponse event.
 */
module.exports = function(response) {
    var self = this;

    var log = self.log;
    var config = self.config;

    var client = self.client;
    var steamFriends = self.steamFriends;
    var Steam = self.Steam;

    var utils = new Utils(self);

    // EResult OK
    if(response.eresult === Steam.EResult.OK) {
        // Resolve name and persona state
        var onlineState = utils.stringToEnum(config.state, Steam.EPersonaState);

        if(onlineState === null) {
            log.warn("State value '" + config.state + "' in your config is set incorrectly.");
            log.warn("Defaulting to: Online");

            onlineState = Steam.EPersonaState.Online;
        }

        var displayName = config.displayName || "Vapor Bot";

        log.info(displayName + " logged in successfully.");

        // Set name and persona state
        steamFriends.setPersonaState(onlineState);
        steamFriends.setPersonaName(displayName);

        // Emit ready event
        self.emit('ready');

        // Call web login
        self.webLogOn(response.webapi_authenticate_user_nonce, function(cookies) {
            self.log.info("Received new web cookies.");
            self.cookies = cookies;
            self.emit('cookies', cookies);
        });

    // Auth code needed
    } else if(response.eresult === Steam.EResult.AccountLogonDenied ||
        response.eresult === Steam.EResult.AccountLoginDeniedNeedTwoFactor) {

        // Call disconnect manually so we don't receive 'error' event
        client.disconnect();

        // Retrieve auth code
        prompt.start();

        prompt.get([{
                name: "authCode",
                description: "Please enter the SteamGuard code",
                type: "string",
                required: true
            }],
            function (err, result) {
                if (err) {
                    log.error(err + " reading authentication code.");
                    process.exit(1);
                } else {
                    if(response.eresult === Steam.EResult.AccountLogonDenied) {
                        self.loginOptions.auth_code = result.authCode;
                    } else {
                        self.loginOptions.two_factor_code = result.authCode;
                    }

                    // Let's reconnect
                    client.connect();
                }
            }
        );
    }

    // Invalid password - abort
    else if(response.eresult === Steam.EResult.InvalidPassword) {
        client.disconnect();

        log.error("Wrong password! Please check your config file and try again.");
        process.exit(1);
    }

    // Other error
    else {
        client.disconnect();

        log.error("Steam logOn error caught. Response:");
        log.error(response);
        process.exit(1);
    }
};
