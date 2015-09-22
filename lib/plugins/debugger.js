/**
 * Logs all `debug` events emitted by any emitter to console.
 * @example
 * bot.use(vapor.plugins.debugger);
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
exports.name = 'debugger';

exports.plugin = function(VaporAPI) {
    VaporAPI.registerHandler({
            emitter: '*',
            event: 'debug'
        },
        function(message) {
            console.log('[DEBUGGER]: ' + message);
        }
    );
};
