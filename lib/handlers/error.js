var prompt = require('prompt');

/**
 * Default event handler for error event.
 * @param  {object} error Error object.
 */
module.exports = function(error) {
    var log = this.log;
    var config = this.config;
    var client = this.client;
    var errorCode = error.eresult;
    var Steam = this.Steam;

    if(errorCode === Steam.EResult.AccountLogonDenied ||
       errorCode === Steam.EResult.InvalidLoginAuthCode ||
       errorCode === Steam.EResult.ExpiredLoginAuthCode ||
       errorCode === Steam.EResult.AccountLoginDeniedNeedTwoFactorCode ||
       errorCode === Steam.EResult.TwoFactorCodeMismatch) {
        prompt.start();

        prompt.get([{
            name: "authCode",
            description: "Please enter the SteamGuard code",
            type: "string",
            required: true
        }], function (err, result) {
            if (err) {
                log.error(err + " reading authentication code.");
                process.exit(1);
            } else {
                var options = {};
                options.accountName = config.username;
                options.password = config.password;

                if(errorCode === Steam.EResult.AccountLogonDenied) {
                    options.authCode = result.authCode;
                } else {
                    options.twoFactorCode = result.authCode;
                }

                client.logOn({
                    accountName: config.username,
                    password: config.password,
                    authCode: result.authCode
                });
            }
        });
    }

    else if(errorCode === Steam.EResult.InvalidPassword) {
        log.error("Wrong password! Please check your config file and try again.");
        process.exit(1);
    }

    else {
        log.error("Steam error caught. EResult: " + error.eresult);
        log.error(error);
        process.exit(1);
    }
};
