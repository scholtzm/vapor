var path = require('path');
var winston = require('winston');
var moment = require('moment');

var Misc = require('./misc.js');

module.exports = function(config) {
    var loggerConfig = config.logs;
    var username = config.username || 'Error: Missing username in the config.';
    var filePath = path.join(config.dataDir, Misc.DATA_LOG_DIR, username + '.log');

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
        },
        transports: []
    };

    if(loggerConfig.consoleLevel !== 'none') {
        logOptions.transports.push(new (winston.transports.Console)({
            timestamp: function() { return moment().format(loggerConfig.dateFormat || 'YYYY-MM-DD HH:mm:ss'); },
            level: loggerConfig.consoleLevel || 'error',
            colorize: true
        }));
    }

    if(loggerConfig.fileLevel !== 'none') {
        logOptions.transports.push(new (winston.transports.File)({
            filename: filePath,
            timestamp: function() { return moment().format(loggerConfig.dateFormat || 'YYYY-MM-DD HH:mm:ss'); },
            level: loggerConfig.fileLevel || 'debug',
            json: false
        }));
    }

    return new (winston.Logger)({
        levels: logOptions.levels,
        colors: logOptions.colors,
        transports: logOptions.transports
    });
};
