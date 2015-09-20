/**
 * Provides file system handler for all Vapor file operations.
 *
 * @example
 * bot.use(vapor.plugins.fs);
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
var fs = require('fs');
var path = require('path');

exports.name = 'fs';

exports.plugin = function(VaporAPI) {

    var dataDir = VaporAPI.data || './data';

    // Create data directory
    if (!fs.existsSync(dataDir)){
        fs.mkdirSync(dataDir);
    }

    // Handle the 'readFile' event
    VaporAPI.registerHandler({
            emitter: 'vapor',
            event: 'readFile'
        }, function(key, callback) {
            var filePath = path.join(dataDir, key);

            fs.access(filePath, fs.R_OK, function(err) {
                if(!err) {
                    fs.readFile(filePath, function(err, data) {
                        if(!err) {
                            callback(data);
                        } else {
                            callback();
                        }
                    });
                } else {
                    callback();
                }
            });
        }
    );

    // Handle the writeFile event
    VaporAPI.registerHandler({
            emitter: 'vapor',
            event: 'writeFile'
        }, function(key, data, callback) {
            fs.writeFile(path.join(dataDir, key), data, function() {
                if(typeof callback === 'function') {
                    callback();
                }
            });
        }
    );

};
