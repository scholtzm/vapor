var Misc = require('../misc.js');

/**
 * Default event handler for connected event.
 */
module.exports = function() {
    var self = this;
    var config = this.config;
    var sentry = this.sentryFile;
    var steamUser = this.steamUser;
    var log = this.log;

    function proceedLogin(sentryData) {
        self.loginOptions.account_name = config.username;
        self.loginOptions.password = config.password;

        if(sentryData) {
            var sha = Misc.getSHA(sentryData);
            self.loginOptions.sha_sentryfile = sha;
        }

        log.info('Connected to Steam network. Logging in...');

        steamUser.logOn(self.loginOptions);
    }

    if(this.listeners('readFile').length > 0) {
        this.emit('readFile', sentry, function(data) {
            proceedLogin(data);
        });
    } else {
        proceedLogin();
    }
};
