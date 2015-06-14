var fs      = require('fs');
var winston = require('winston');
var moment  = require('moment');

module.exports = function(config) {
    var loggerConfig = config.logs;

    var logDirectoryExists = fs.existsSync(process.cwd() + '/logs');

    if (!logDirectoryExists)
        fs.mkdirSync(process.cwd() + '/logs');

    var username = config.username || 'error';

    var logOptions = {
        levels: {
            debug: 0,
            error: 1,
            warn: 2,
            info: 3
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
                timestamp: function() { return moment().format(loggerConfig.dateFormat || 'YYYY-MM-DD HH:mm:ss'); },
                level: loggerConfig.consoleLevel || 'error',
                colorize: true
            }),
            new (winston.transports.File)({
                filename: 'logs/' + username + '.log',
                timestamp: function() { return moment().format(loggerConfig.dateFormat || 'YYYY-MM-DD HH:mm:ss'); },
                level: loggerConfig.fileLevel || 'debug',
                json: false
            })
        ]
    });
};
