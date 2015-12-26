/**
 * Event handler for ClientNewLoginKey message
 */
module.exports = function(header, body) {
  var vapor = this;
  var Steam = vapor._Steam;

  if(header.msg === Steam.EMsg.ClientNewLoginKey) {
    var response = Steam.Internal.CMsgClientNewLoginKey.decode(body);

    delete vapor._loginOptions.password;
    vapor._loginOptions.login_key = response.login_key;

    // the key is not reusable if the user does not set rememberPassword
    if(vapor._config.rememberPassword) {
      vapor.emit('loginKey', response.login_key);
    }
  }
};
