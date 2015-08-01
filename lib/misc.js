var path = require('path');
var mkdirp = require('mkdirp');

var Misc = {};

Misc.createFolderStructure = function(dataDir) {
    var paths = [
        dataDir,
        path.join(dataDir, 'logs'),
        path.join(dataDir, 'misc'),
        path.join(dataDir, 'plugins'),
        path.join(dataDir, 'sentry')
    ];

    paths.forEach(function(path) {
        mkdirp.sync(path);
    });
};

module.exports = Misc;
