var vapor = require('../');
var expect = require('chai').expect;

describe('Vapor class', function () {

  it('is correctly instantiated', function(done) {
    var client = vapor();
    var EventEmitter = require('events').EventEmitter;

    expect(client).to.have.ownProperty('servers');
    expect(client).to.be.instanceof(EventEmitter);

    return done();
  });

  it('method init works correctly', function(done) {
    var client = vapor();

    var fn1 = function() { client.init(); };
    var fn2 = function() { client.init({username: 'a'}); };
    var fn3 = function() { client.init({username: 'a', password: 'b'}); };
    var fn4 = function() { client.init({username: 'a', loginKey: 'c'}); };

    expect(fn1).to.throw(/Config error/);
    expect(fn2).to.throw(/Config error/);
    expect(fn3).to.not.throw(/Config error/);
    expect(fn4).to.not.throw(/Config error/);

    return done();
  });

  it('method init can be called multiple times', function(done) {
    var client = vapor();

    client
      .init({username: 'a', password: 'b'})
      .use({
        name: 'j',
        plugin: function(API) {
          API.registerHandler({
            emitter: 'vapor',
            event: 'c'
          }, function(){});
        }
      })
      .use({name: 'k', plugin: function(){}})
      .use({name: 'l', plugin: function(){}});

    expect(client._loadedPlugins).to.be.length(3);
    expect(client._client.listeners('connected').length).to.be.equal(1);
    expect(client.listeners('c').length).to.be.equal(1);

    client
      .init({username: 'a', password: 'b'})
      .use({
        name: 'j',
        plugin: function(API) {
          API.registerHandler({
            emitter: 'vapor',
            event: 'c'
          }, function(){});
        }
      })
      .use({name: 'k', plugin: function(){}})
      .use({name: 'l', plugin: function(){}});

    expect(client._loadedPlugins).to.be.length(3);
    expect(client._client.listeners('connected').length).to.be.equal(1);
    expect(client.listeners('c').length).to.be.equal(1);

    return done();
  });

  it('method use works correctly', function(done) {
    var client = vapor();

    client.init({username: 'a', password: 'b'});

    var fn1 = function() {
      client.use({
        name: 'test',
        plugin: function() {}
      });
    };

    fn1();

    expect(client._loadedPlugins).to.be.deep.equal(['test']);
    expect(fn1).to.throw(/already loaded/);

    return done();
  });

  it('init and use methods are chainable', function(done) {
    var client = vapor();

    client
      .init({username: 'a', password: 'b'})
      .use({
        name: 'plugin A',
        plugin: function() {}
      })
      .use({
        name: 'plugin B',
        plugin: function() {}
      });

    expect(client).to.have.ownProperty('servers');
    expect(client._loadedPlugins).to.have.length(2);
    expect(client._loadedPlugins).to.be.deep.equal(['plugin A', 'plugin B']);

    return done();
  });

});
