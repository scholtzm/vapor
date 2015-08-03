function containsSwearWord(text, wordList) {
    for (var i = 0; i < wordList.length; i++) {
        if(text.indexOf(wordList[i]) > -1) {
            return true;
        }
    }

    return false;
}

exports.name = 'no-swearing';

exports.plugin = function(VaporAPI) {

    var steamFriends = VaporAPI.getHandler('steamFriends');
    var Steam = VaporAPI.getSteam();
    var config = (VaporAPI.data && VaporAPI.data.config) ? VaporAPI.data.config : {};
    var log = VaporAPI.getLogger();
    var utils = VaporAPI.getUtils();

    var words = config.words || [];
    var action = config.action || 'warning';

    VaporAPI.registerHandler({
            emitter: 'steamFriends',
            event: 'friendMsg'
        },
        function(user, message, type) {
            if(type === Steam.EChatEntryType.ChatMsg) {

                if(utils.isAdmin(user)) {
                    return;
                }

                if(containsSwearWord(message, words)) {
                    if(action === 'warning') {
                        steamFriends.sendMessage(user, 'Please, do not use swear words.');
                    } else if(action === 'kick') {
                        steamFriends.removeFriend(user);
                        log.warn('User with SteamID ' + user + ' was removed for swearing!');
                    } else {
                        log.error('Unknown action: ' + action);
                    }
                }

            }
        }
    );

};
