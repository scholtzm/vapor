var prompt = require('prompt');
var Utils = require('../utils.js');

/**
 * Default event handler for logOnResponse event.
 */
module.exports = function(response) {
    var vapor = this;

    var log = vapor.log;
    var config = vapor.config;

    var client = vapor.client;
    var steamFriends = vapor.steamFriends;
    var Steam = vapor.Steam;

    var utils = new Utils(vapor);

    // EResult OK
    if(response.eresult === Steam.EResult.OK) {
        // Resolve name and persona state
        var onlineState = utils.stringToEnum(config.state, Steam.EPersonaState);

        if(onlineState === null) {
            log.warn('State value "%s" in your config is set incorrectly.', config.state);
            log.warn('Defaulting to: Online');

            onlineState = Steam.EPersonaState.Online;
        }

        var displayName = config.displayName || 'Vapor Bot';

        log.info('%s logged in successfully.', displayName);

        // Set name and persona state
        steamFriends.setPersonaState(onlineState);
        steamFriends.setPersonaName(displayName);

        // Emit ready event
        vapor.emit('ready');

        // Call web login
        vapor.webLogOn(response.webapi_authenticate_user_nonce);

    // Auth code needed
    } else if(response.eresult === Steam.EResult.AccountLogonDenied ||
        response.eresult === Steam.EResult.AccountLoginDeniedNeedTwoFactor) {

        // Call disconnect manually so we don't receive 'error' event
        client.disconnect();

        // Retrieve auth code
        prompt.start();

        prompt.get([{
                name: 'authCode',
                description: 'Please enter the SteamGuard code',
                type: 'string',
                required: true
            }],
            function (err, result) {
                if (err) {
                    log.error('%s reading authentication code.', err);
                    process.exit(1);
                } else {
                    if(response.eresult === Steam.EResult.AccountLogonDenied) {
                        vapor.loginOptions.auth_code = result.authCode;
                    } else {
                        vapor.loginOptions.two_factor_code = result.authCode;
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

        log.error('Wrong password! Please check your config file and try again.');
        process.exit(1);
    }

    // Other error
    else {
        client.disconnect();

        log.error('Steam logOn error caught. EResult: %s. Response:', response.eresult);
        log.error(response);
        process.exit(1);
    }
};
