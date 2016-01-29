var vapor = require('../../');
var chai = require('chai');
var spies = require('chai-spies');
var expect = chai.expect;

chai.use(spies);

var client, spyable;

beforeEach(function() {
  client = vapor();
  client.init({username: 'a', password: 'b'});

  spyable = chai.spy();
});

describe('Plugins / admin', function () {

  it('requires data', function(done) {
    var fn = function() { client.use(vapor.plugins.admins); };

    expect(fn).to.throw(/missing array of admin ids/i);
    expect(client._loadedPlugins).to.be.length(0);

    return done();
  });

  it('loads correctly', function(done) {
    var fn = function() { client.use(vapor.plugins.admins, ['7656']); };

    expect(fn).to.not.throw();
    expect(client._loadedPlugins).to.be.length(1);

    return done();
  });

  it('accepts correct ID', function(done) {
    client.use(vapor.plugins.admins, ['7656', '123', '456']);

    client.use({
      name: 'mockplugin',
      plugin: function(API) {
        API.emitEvent('isAdmin', '7656', spyable);
      }
    });

    // console.log(spyable);
    expect(spyable).to.have.been.called.once;
    expect(spyable).to.have.been.called.with(true);

    return done();
  });

  it('rejects incorrect ID', function(done) {
    client.use(vapor.plugins.admins, ['7656', '123', '456']);

    client.use({
      name: 'mockplugin',
      plugin: function(API) {
        API.emitEvent('isAdmin', '789', spyable);
      }
    });

    // console.log(spyable);
    expect(spyable).to.have.been.called.once;
    expect(spyable).to.have.been.called.with(false);

    return done();
  });

});
