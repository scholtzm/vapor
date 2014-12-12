var Steam = require('steam');

/**
 * Event handler for when our bot receives a chat message.
 * @param user User's Steam ID.
 * @param message Message.
 * @param type Message type, see node-steam language.
 */
module.exports = function(user, message, type) {
    var log    = this.log;
    var client = this.client;

    if(type === Steam.EChatEntryType.ChatMsg) {
        log.info(client.users[user].playerName + " (" + user + ") says: " + message);

        client.sendMessage(user, "Hi!");
    }
};