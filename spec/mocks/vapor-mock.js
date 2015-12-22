/**
 * Vapor mock object used for testing
 */
var BasicEmitter = require('./basic-emitter.js');

var vapor = new BasicEmitter();

vapor._client = new BasicEmitter();
vapor._config = {
  admins: ['7656']
};
vapor._steamFriends = {
  personaStates: {
    '7656': {
      player_name: 'vapor'
    }
  }
};

module.exports = vapor;
