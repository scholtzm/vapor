var prompt = require('prompt');

/**
 * Default event handler for error event.
 * @param  {object} error Error object.
 */
module.exports = function(error) {
    var log = this.log;
    var config = this.config;
    var client = this.client;
    var code = error.eresult;
    var Steam = this.Steam;

    if(code === Steam.EResult.AccountLogonDenied || code === Steam.EResult.InvalidLoginAuthCode) {
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
                client.logOn({
                    accountName: config.username,
                    password: config.password,
                    authCode: result.authCode
                });
            }
        });
    }

    else if(code === Steam.EResult.InvalidPassword) {
        log.error("Wrong password! Please check your config file and try again.");
        process.exit(1);
    }

    else {
        log.error("Steam error caught. EResult: " + error.eresult);
        log.error(error);
    }
};
