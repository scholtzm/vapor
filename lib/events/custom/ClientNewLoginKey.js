/**
 * Event handler for ClientNewLoginKey message
 */
module.exports = function(header, body) {
  var vapor = this;
  var Steam = vapor._Steam;

  if(header.msg === Steam.EMsg.ClientNewLoginKey) {
    var response = Steam.Internal.CMsgClientNewLoginKey.decode(body);

    if(vapor._loginOptions.rememberPassword) {
      delete vapor._loginOptions.password;
      vapor._loginOptions.login_key = response.login_key;
    }

    vapor.emit('loginKey', response.login_key);
  }
};
