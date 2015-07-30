var fs = require('fs');
var winston = require('winston');
var moment = require('moment');

module.exports = function(config) {
    var loggerConfig = config.logs;
    var logPath = process.cwd() + '/data/logs';

    if (!fs.existsSync(logPath))
        fs.mkdirSync(logPath);

    var username = config.username || 'error';

    var logOptions = {
        levels: {
            verbose: 0,
            debug: 1,
            error: 2,
            warn: 3,
            info: 4
        },

        colors: {
            verbose: 'magenta',
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
                filename: 'data/logs/' + username + '.log',
                timestamp: function() { return moment().format(loggerConfig.dateFormat || 'YYYY-MM-DD HH:mm:ss'); },
                level: loggerConfig.fileLevel || 'debug',
                json: false
            })
        ]
    });
};
