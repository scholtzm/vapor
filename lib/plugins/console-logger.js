/**
 * Provides simple console logger for `message:*` events emitted by any emitter.
 * @example
 * bot.use(vapor.plugins.consoleLogger);
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
exports.name = 'console-logger';

exports.plugin = function(VaporAPI) {
    VaporAPI.registerHandler({emitter: '*', event: 'message:debug'},
        function(message) { console.log('[DEBUG] ' + message); });
    VaporAPI.registerHandler({emitter: '*', event: 'message:info'},
        function(message) { console.log('[INFO] ' + message); });
    VaporAPI.registerHandler({emitter: '*', event: 'message:warn'},
        function(message) { console.log('[WARNING] ' + message); });
    VaporAPI.registerHandler({emitter: '*', event: 'message:error'},
        function(message) { console.log('[ERROR] ' + message); });
};
