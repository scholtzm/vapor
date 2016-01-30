var vapor = require('../../');
var chai = require('chai');
var expect = chai.expect;

var client;

beforeEach(function() {
  client = vapor();
  client.init({username: 'a', password: 'b'});
});

describe('Plugins / presence', function () {

  it('requires data', function(done) {
    var fn = function() { client.use(vapor.plugins.presence); };

    expect(fn).to.throw(/missing config/i);
    expect(client._loadedPlugins).to.be.length(0);

    return done();
  });

  it('loads correctly', function(done) {
    var dummyConfig = {displayName: 'name', state: 'online'};
    var fn = function() { client.use(vapor.plugins.presence, dummyConfig); };

    expect(fn).to.not.throw();
    expect(client._loadedPlugins).to.be.length(1);

    return done();
  });

});
