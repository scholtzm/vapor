/**
 * Vapor
 * @type {Vapor|exports}
 */

var Vapor  = require('./lib/');

var configPath = "./config";
if(process.argv.length > 2)
    configPath = process.argv[2];

var config = require(configPath);

// Create new Vapor instance
var vapor  = new Vapor();

// Let's go!
vapor.init(config);
