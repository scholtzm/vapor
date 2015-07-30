var fs = require('fs');
var crypto = require('crypto');

/**
 * Default event handler for connected event.
 */
module.exports = function() {
    var config = this.config;
    var sentry = this.sentryFilePath;
    var steamUser = this.steamUser;
    var log = this.log;

    var sha = '';
    if(fs.existsSync(sentry)) {
        var file = fs.readFileSync(sentry);
        sha = crypto.createHash('sha1').update(file).digest();
    }

    log.info('Connected to Steam network. Logging in...');

    this.loginOptions.account_name = config.username;
    this.loginOptions.password = config.password;
    this.loginOptions.sha_sentryfile = sha;

    steamUser.logOn(this.loginOptions);
};
