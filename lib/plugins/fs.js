/**
 * Provides very simple file system handler for all Vapor file operations.
 *
 * @example
 * // use the default folder './data'
 * bot.use(vapor.plugins.fs);
 *
 * // use our own data folder
 * bot.use(vapor.plugins.fs, './myDataFolder');
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

            fs.readFile(filePath, function(err, data) {
                if(!err) {
                    callback(data);
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
