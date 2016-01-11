/**
 * Event handler for ClientNewLoginKey message
 */
module.exports = function(header, body) {
  var vapor = this;
  var client = vapor._client;
  var Steam = vapor._Steam;

  if(header.msg === Steam.EMsg.ClientNewLoginKey) {
    var response = Steam.Internal.CMsgClientNewLoginKey.decode(body);

    // accept the key every time since we use it for basic reconnecting as well
    client.send({
      msg: Steam.EMsg.ClientNewLoginKeyAccepted,
      proto: {}
    }, new Steam.Internal.CMsgClientNewLoginKeyAccepted({
      unique_id: response.unique_id
    }).toBuffer());

    delete vapor._loginOptions.password;
    vapor._loginOptions.login_key = response.login_key;

    // the key is not reusable if the user does not set rememberPassword
    if(vapor._config.rememberPassword) {
      vapor.emit('loginKey', response.login_key);
    }
  }
};
