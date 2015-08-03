var path = require('path');
var crypto = require('crypto');
var mkdirp = require('mkdirp');

var Misc = {};

Misc.DATA_LOG_DIR = 'logs';
Misc.DATA_MISC_DIR = 'misc';
Misc.DATA_PLUGIN_DIR = 'plugins';
Misc.DATA_SENTRY_DIR = 'sentry';

Misc.createFolderStructure = function(dataDir) {
    var paths = [
        dataDir,
        path.join(dataDir, this.DATA_LOG_DIR),
        path.join(dataDir, this.DATA_MISC_DIR),
        path.join(dataDir, this.DATA_PLUGIN_DIR),
        path.join(dataDir, this.DATA_SENTRY_DIR)
    ];

    paths.forEach(function(path) {
        mkdirp.sync(path);
    });
};

Misc.getSHA = function(bytes) {
    return crypto.createHash('sha1').update(bytes).digest();
};

module.exports = Misc;
