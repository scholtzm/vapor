var ByteBuffer = require('bytebuffer');

/**
 * Automatically removes and logs all pending chat messages.
 *
 * Use this plugin if you want to get rid of pending notifications
 * related to offline messages.
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
function offlineMessages(VaporAPI) {

    var client = VaporAPI.getClient();
    var Steam = VaporAPI.getSteam();
    var log = VaporAPI.getLogger();
    var utils = VaporAPI.getUtils();

    // Handle 'ClientPersonaState' EMsg
    VaporAPI.registerHandler({
            emitter: 'client',
            event: 'message'
        },
        function(header) {
            if(header.msg === Steam.EMsg.ClientPersonaState) {
                // Let's wait couple seconds for 'personaStates' to fill up
                setTimeout(client.send({
                        msg: Steam.EMsg.ClientFSGetFriendMessageHistoryForOfflineMessages,
                        proto: {}
                    },
                    new Steam.Internal.CMsgClientFSGetFriendMessageHistoryForOfflineMessages().toBuffer()
                ), 5000);
            }
        }
    );

    // Handle 'ClientFSGetFriendMessageHistoryResponse' EMsg
    VaporAPI.registerHandler({
            emitter: 'client',
            event: 'message'
        },
        function(header, body) {
            if(header.msg === Steam.EMsg.ClientFSGetFriendMessageHistoryResponse) {
                var data = ByteBuffer.wrap(body, ByteBuffer.LITTLE_ENDIAN);
                var response = Steam.Internal.CMsgClientFSGetFriendMessageHistoryResponse.decode(data);

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
        }
    );

}

module.exports = {name: 'offline-messages', plugin: offlineMessages};
