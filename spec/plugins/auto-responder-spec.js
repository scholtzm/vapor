var vapor = require('../../');
var Steam = require('steam');
var BasicEmitter = require('../mocks/basic-emitter.js');
var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);
var expect = chai.expect;

var client, sendMessage;

beforeEach(function() {
  client = vapor();
  client.init({username: 'a', password: 'b'});

  sendMessage = chai.spy();

  client._client = new BasicEmitter();
  client._steamFriends = new BasicEmitter();
  client._steamFriends.sendMessage = sendMessage;
});

describe('Plugins / auto-responder', function () {

  it('requires response', function(done) {
    var fn = function() { client.use(vapor.plugins.autoResponder); };

    expect(fn).to.throw(/missing response/i);
    expect(client._loadedPlugins).to.be.length(0);

    return done();
  });

  it('loads correctly', function(done) {
    var fn = function() { client.use(vapor.plugins.autoResponder, 'response'); };

    expect(fn).to.not.throw();
    expect(client._loadedPlugins).to.be.length(1);

    return done();
  });

  it('responds to chat messages', function() {
    client.use(vapor.plugins.autoResponder, 'response');

    client._steamFriends.emit('friendMsg', 'user', 'message', Steam.EChatEntryType.ChatMsg);
    client._steamFriends.emit('friendMsg', 'user', 'message', Steam.EChatEntryType.ChatMsg);
    client._steamFriends.emit('friendMsg', 'user', 'message', Steam.EChatEntryType.ChatMsg);

    expect(sendMessage).to.have.been.called.exactly(3);
  });

});
