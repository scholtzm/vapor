var fs      = require('fs');
var winston = require('winston');
var moment  = require('moment');

module.exports = function(config) {
    var logDirectoryExists = fs.existsSync(process.cwd() + '/logs');

    if (!logDirectoryExists)
        fs.mkdirSync(process.cwd() + '/logs');

    var username = config.username || 'error';

    var logOptions = {
        levels: {
            info: 1,
            warn: 2,
            error: 3,
            debug: 4
        },

        colors: {
            debug: 'grey',
            info: 'green',
            warn: 'yellow',
            error: 'red'
        }
    };

    return new (winston.Logger)({
        levels: logOptions.levels,
        colors: logOptions.colors,
        transports: [
            new (winston.transports.Console)({
                timestamp: function() { return moment().format('YYYY-MM-DD HH:mm:ss'); },
                colorize: true
            }),
            new (winston.transports.File)({
                filename: 'logs/' + username + '.log',
                timestamp: function() { return moment().format('YYYY-MM-DD HH:mm:ss'); },
                json: false
            })
        ]
    });
};
