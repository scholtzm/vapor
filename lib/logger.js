var path = require('path');
var util = require('util');
var winston = require('winston');
var moment = require('moment');

var Misc = require('./misc.js');

module.exports = function(config) {
    var loggerConfig = config.logs;
    var username = config.username;
    var filePath = path.join(config.dataDir, Misc.DATA_LOG_DIR, username + '.log');

    var logOptions = {
        levels: {
            verbose: 0,
            debug: 1,
            info: 2,
            warn: 3,
            error: 4
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

    // Add transports if possible
    if(loggerConfig.consoleLevel !== 'none') {
        logOptions.transports.push(new (winston.transports.Console)({
            timestamp: function() { return moment().format(loggerConfig.dateFormat); },
            level: loggerConfig.consoleLevel,
            colorize: true
        }));
    }

    if(loggerConfig.fileLevel !== 'none') {
        logOptions.transports.push(new (winston.transports.File)({
            filename: filePath,
            timestamp: function() { return moment().format(loggerConfig.dateFormat); },
            level: loggerConfig.fileLevel,
            json: false
        }));
    }

    // Create logger instance
    var logger = new (winston.Logger)({
        levels: logOptions.levels,
        colors: logOptions.colors,
        transports: logOptions.transports
    });

    // Add prefix if necessary
    if(loggerConfig.prefix === true) {
        logger.addFilter(function(msg) {
            return util.format('[%s] %s', username, msg);
        });
    }

    return logger;
};
