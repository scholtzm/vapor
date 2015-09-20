var Misc = require('../misc.js');

/**
 * Default event handler for connected event.
 */
module.exports = function() {
    var self = this;
    var config = this._config;
    var sentry = this._sentryFile;
    var steamUser = this._steamUser;
    var log = this.log;

    function proceedLogin(sentryData) {
        self._loginOptions.account_name = config.username;
        self._loginOptions.password = config.password;

        if(sentryData) {
            var sha = Misc.getSHA(sentryData);
            self._loginOptions.sha_sentryfile = sha;
        }

        log.info('Connected to Steam network. Logging in...');

        steamUser.logOn(self._loginOptions);
    }

    if(this.listeners('readFile').length > 0) {
        this.emit('readFile', sentry, function(data) {
            proceedLogin(data);
        });
    } else {
        proceedLogin();
    }
};
