var crypto = require('crypto');
var extend = require('extend');

var Helper = {};

Helper.DEFAULT_CONFIG = {
    displayName: '[Vapor] Automated Steam Client',
    admins: [],
    state: 'Online'
};

Helper.verifyConfig = function(config) {
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

Helper.getSHA = function(bytes) {
    return crypto.createHash('sha1').update(bytes).digest();
};

module.exports = Helper;
