var Helper = require('../helper.js');

/**
 * Default event handler for connected event.
 */
module.exports = function() {
    var vapor = this;
    var config = this._config;
    var sentry = this._sentryFile;
    var steamUser = this._steamUser;

    function proceedLogin(sentryData) {
        vapor._loginOptions.account_name = config.username;
        vapor._loginOptions.password = config.password;

        if(sentryData) {
            var sha = Helper.getSHA(sentryData);
            vapor._loginOptions.sha_sentryfile = sha;
        }

        vapor.emit('message:info', 'Connected to Steam network. Logging in...');

        steamUser.logOn(vapor._loginOptions);
    }

    if(this.listeners('readFile').length > 0) {
        this.emit('readFile', sentry, function(error, data) {
            // File most likely doesn't exist
            if(error) {
                proceedLogin();
            } else {
                proceedLogin(data);
            }
        });
    } else {
        // There's no handler to process our request
        proceedLogin();
    }
};
