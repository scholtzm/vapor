/**
 * Automatically reconnects to Steam network if:
 *
 * * we get disconnected
 * * we receive `ServiceUnavailable` or `TryAnotherCM` after logging in
 *
 * Any other case is ignored.
 * @example
 * // use default reconnect timeout of 5000ms (5 seconds)
 * bot.use(vapor.plugins.reconnectOnError);
 *
 * // supply our own timeout value of 3000ms (3 seconds)
 * bot.use(vapor.plugins.reconnectOnError, 3000);
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
exports.name = 'reconnect-on-error';

exports.plugin = function(VaporAPI) {
    var DEFAULT_TIMEOUT = 5000;

    var timeout = VaporAPI.data || DEFAULT_TIMEOUT;
    var Steam = VaporAPI.getSteam();
    var log = VaporAPI.getLogger();

    // Handle 'error' event
    VaporAPI.registerHandler({
            emitter: 'vapor',
            event: 'error'
        },
        function(error) {
            switch(error.eresult) {
                case Steam.EResult.NoConnection:
                case Steam.EResult.ServiceUnavailable:
                case Steam.EResult.TryAnotherCM:
                    log.info('Reconnecting in %dms.', timeout);
                    setTimeout(VaporAPI.connect, timeout);
                    break;

                default:
                    // Ignore anything else
                    break;
            }
        }
    );
};
