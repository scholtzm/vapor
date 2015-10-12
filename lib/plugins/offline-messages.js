/**
 * Automatically removes and emits 'message:info' events
 * for all pending chat messages.
 *
 * Use this plugin if you want to get rid of pending notifications
 * related to offline messages.
 * @example
 * bot.use(vapor.plugins.offlineMessages);
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
exports.name = 'offline-messages';

exports.plugin = function(VaporAPI) {

  var log = VaporAPI.getLogger();
  var client = VaporAPI.getClient();
  var Steam = VaporAPI.getSteam();
  var utils = VaporAPI.getUtils();

  // Handle 'ready' event
  VaporAPI.registerHandler({
    emitter: 'vapor',
    event: 'ready'
  }, function() {
    setTimeout(function() {
      client.send({
        msg: Steam.EMsg.ClientFSGetFriendMessageHistoryForOfflineMessages,
        proto: {}
      }, new Steam.Internal.CMsgClientFSGetFriendMessageHistoryForOfflineMessages().toBuffer());
    }, 5000);
  }
);

  // Handle 'ClientFSGetFriendMessageHistoryResponse' EMsg
  VaporAPI.registerHandler({
    emitter: 'client',
    event: 'message'
  }, function(header, body) {
    if(header.msg === Steam.EMsg.ClientFSGetFriendMessageHistoryResponse) {
      var response = Steam.Internal.CMsgClientFSGetFriendMessageHistoryResponse.decode(body);

      var unreadMessages = response.messages.filter(function(message) {
        return message.unread;
      });

      log.info('# of pending chat messages: %d', unreadMessages.length);

      unreadMessages.forEach(function(message) {
        var sid = utils.accountIDToSteamID(message.accountid);
        var user = utils.getUserDescription(sid);

        log.info('[%s] %s said: %s',
          utils.getTimestamp(message.timestamp),
          user,
          message.message
        );
      });
    }
  });

};
