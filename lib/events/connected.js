var Helper = require('../helper.js');

/**
 * Default event handler for connected event.
 */
module.exports = function() {
  var vapor = this;
  var config = vapor._config;
  var sentry = vapor._sentryFile;
  var steamUser = vapor._steamUser;

  function proceedLogin(sentryData) {
    vapor._loginOptions.account_name = config.username;
    vapor._loginOptions.password = config.password;
    vapor._loginOptions.login_key = config.loginKey;
    vapor._loginOptions.should_remember_password = !!config.rememberPassword;

    if(sentryData) {
      var sha = Helper.getSHA(sentryData);
      vapor._loginOptions.sha_sentryfile = sha;
    }

    vapor.emit('message:info', 'Connected to Steam network. Logging in...');

    steamUser.logOn(vapor._loginOptions);
  }

  if(vapor.listeners('readFile').length > 0) {
    vapor.emit('readFile', sentry, function(error, data) {
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
