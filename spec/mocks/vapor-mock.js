/**
 * Vapor mock object used for testing
 */
var BasicEmitter = require('./basic-emitter.js');

module.exports = {
  _client: new BasicEmitter(),
  _config: {
    admins: ['7656']
  },
  _steamFriends: {
    personaStates: {
      '7656': {
        player_name: 'vapor'
      }
    }
  }
};
