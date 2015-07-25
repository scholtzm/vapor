/* global describe, it */
/* jshint expr:true */

var Steam = require('steam');
var VaporDummy = require('./vapormock.js');
var expect = require('chai').expect;

var Utils = require('../lib/utils.js');

var utils = new Utils(VaporDummy);

describe('Utils class tests', function () {

    it('identifies vapor admin', function(done) {
        var result_true = utils.isAdmin("76561197960435530");
        var result_false = utils.isAdmin("76561197965532939");

        expect(result_true).to.be.true;
        expect(result_false).to.be.false;

        return done();
    });

    it('gives me short plugin name', function(done) {
        var result1 = utils.getShortPluginName("vapor-test-name");
        var result2 = utils.getShortPluginName("test-name-vapor");
        var result3 = utils.getShortPluginName("vapor-");
        var result4 = utils.getShortPluginName("test-name-vapor-");

        expect(result1).to.be.equal("test-name");
        expect(result2).to.be.equal("test-name-vapor");
        expect(result3).to.be.equal("");
        expect(result4).to.be.equal("test-name-vapor-");

        return done();
    });

    it('gives me correct enum value from string', function(done) {
        var result1 = utils.stringToEnum("Looking to Trade", Steam.EPersonaState);
        var result2 = utils.stringToEnum("Trade", Steam.EPersonaState);
        var result3 = utils.stringToEnum("does not exist", Steam.EPersonaState);

        expect(result1).to.be.equal(5);
        expect(result2).to.be.equal(5);
        expect(result3).to.be.null;

        return done();
    });

    it('gives me correct string value from enum', function(done) {
        var result1 = utils.enumToString(5, Steam.EPersonaState);
        var result2 = utils.enumToString(1, Steam.EPersonaState);
        var result3 = utils.enumToString(1000, Steam.EPersonaState);

        expect(result1).to.be.equal("LookingToTrade");
        expect(result2).to.be.equal("Online");
        expect(result3).to.be.null;

        return done();
    });

    it('gives me correct SteamID from account ID', function(done) {
        var sid = utils.accountIDToSteamID(169802);

        expect(sid).to.be.equal("76561197960435530");

        return done();
    });

    it('gives me correct account ID from SteamID', function(done) {
        var aid = utils.steamIDToAccountID("76561197960435530");

        expect(aid).to.be.equal(169802);

        return done();
    });

    it('gives me correctly formatted unix timestamp', function(done) {
        var result1 = utils.getTimestamp(0);
        var result2 = utils.getTimestamp(0, 'DD.MM.YYYY HH:mm:ss');

        expect(result1).to.be.equal("1970-01-01 01:00:00");
        expect(result2).to.be.equal("01.01.1970 01:00:00");

        return done();
    });

});
