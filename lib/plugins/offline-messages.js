var ByteBuffer = require('bytebuffer');

/**
 * Automatically removes and logs all pending chat messages.
 *
 * Use this plugin if you want to get rid of pending notifications
 * related to offline messages.
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
module.exports = function(VaporAPI) {

    var client = VaporAPI.getClient();
    var steamFriends = VaporAPI.getHandler('steamFriends');
    var Steam = VaporAPI.getSteam();
    var log = VaporAPI.getLogger();
    var utils = VaporAPI.getUtils();

    // Handle 'ClientPersonaState' EMsg
    client.on('message', function(header) {
        if(header.msg === Steam.EMsg.ClientPersonaState) {
            // Let's wait couple seconds for 'personaStates' to fill up
            setTimeout(client.send({
                    msg: Steam.EMsg.ClientFSGetFriendMessageHistoryForOfflineMessages,
                    proto: {}
                },
                new Steam.Internal.CMsgClientFSGetFriendMessageHistoryForOfflineMessages().toBuffer()
            ), 5000);
        }
    });

    // Log unread offline messages
    client.on('message', function(header, body) {
        if(header.msg === Steam.EMsg.ClientFSGetFriendMessageHistoryResponse) {
            var data = ByteBuffer.wrap(body, ByteBuffer.LITTLE_ENDIAN);
            var response = Steam.Internal.CMsgClientFSGetFriendMessageHistoryResponse.decode(data);

            var unreadMessages = response.messages.filter(function(message) {
                return message.unread;
            });

            log.info("# of pending chat messages: " + unreadMessages.length);

            unreadMessages.forEach(function(message) {
                var sid = utils.accountIDToSteamID(message.accountid);
                var user = (sid in steamFriends.personaStates) ?
                    sid :
                    steamFriends.personaStates[sid].player_name + " (" + sid + ")";

                log.info(
                    "[" +
                    utils.getTimestamp(message.timestamp) +
                    "] " +
                    user +
                    " said: " +
                    message.message
                );
            });
        }
    });

};
