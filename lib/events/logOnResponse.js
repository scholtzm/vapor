/**
 * Default event handler for logOnResponse event.
 */
module.exports = function(response) {
  var vapor = this;

  var config = vapor._config;
  var client = vapor._client;
  var steamFriends = vapor._steamFriends;
  var Steam = vapor._Steam;
  var utils = vapor._utils;

  switch(response.eresult) {
    case Steam.EResult.OK:
      vapor._hasLoggedOn = true;

      // We got logged in, update our loginOptions object for future reconnects
      vapor._loginOptions.last_session_id = vapor._client._sessionID;
      vapor._loginOptions.client_instance_id = response.client_instance_id;
      vapor._loginOptions.cell_id = response.cell_id;

      // Resolve persona state
      var onlineState = utils.stringToEnum(config.state, Steam.EPersonaState);

      if(onlineState === null) {
        vapor.emit('message:info', 'State value "' + config.state + '" in your config is set incorrectly.');
        vapor.emit('message:info', 'Defaulting to: Online');

        onlineState = Steam.EPersonaState.Online;
      }

      vapor.emit('message:info', config.username + ' logged in successfully.');

      // Set name and persona state
      if(config.displayName) {
        steamFriends.setPersonaName(config.displayName);
      }
      steamFriends.setPersonaState(onlineState);

      // Emit ready event
      vapor.emit('ready');

      // Call web login
      vapor._webLogOn(response.webapi_authenticate_user_nonce);

      break;

    case Steam.EResult.AccountLogonDenied:
    case Steam.EResult.AccountLoginDeniedNeedTwoFactor:
    case Steam.EResult.TwoFactorCodeMismatch:
      // Call disconnect manually so we don't receive 'error' event
      client.disconnect();

      vapor.emit('steamGuard', function(code) {
        if(response.eresult === Steam.EResult.AccountLogonDenied) {
          vapor._loginOptions.auth_code = code;
        } else {
          vapor._loginOptions.two_factor_code = code;
        }

        // Let's reconnect
        client.connect();
      });

      break;

    default:
      client.disconnect();

      vapor.emit('message:warn', 'Steam login error: ' + utils.enumToString(response.eresult, Steam.EResult) + '.');

      var error = new Error('Login error.');
      error.eresult = response.eresult;
      vapor.emit('disconnected', error);
  }
};
