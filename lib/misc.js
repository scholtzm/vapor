var crypto = require('crypto');
var extend = require('extend');

var Misc = {};

Misc.DEFAULT_CONFIG =  {
    displayName: '[Vapor] Automated Steam Client',
    admins: [],
    state: 'Online',
    logs: {
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        consoleLevel: 'debug',
        fileLevel: 'debug',
        prefix: false
    }
};

Misc.verifyConfig = function(config) {
    var extended = extend(true, {}, this.DEFAULT_CONFIG, config);

    // Only username and password are crucial
    if(!extended.username) {
        throw new Error('Config error: "username" not set.');
    }

    if(!extended.password) {
        throw new Error('Config error: "password" not set.');
    }

    return extended;
};

Misc.getSHA = function(bytes) {
    return crypto.createHash('sha1').update(bytes).digest();
};

module.exports = Misc;
