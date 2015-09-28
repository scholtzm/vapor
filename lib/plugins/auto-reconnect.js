/**
 * Automatically reconnects to Steam network if:
 *
 * * we get disconnected (eresult `NoConnection`)
 * * we receive `ServiceUnavailable` or `TryAnotherCM` after logging in
 *
 * Any other case is ignored.
 * @example
 * // use default reconnect timeout of 5000ms (5 seconds)
 * bot.use(vapor.plugins.autoReconnect);
 *
 * // supply our own timeout value of 3000ms (3 seconds)
 * bot.use(vapor.plugins.autoReconnect, 3000);
 * @param {Object} VaporAPI Instance of the API class.
 * @module
 */
exports.name = 'auto-reconnect';

exports.plugin = function(VaporAPI) {
    var DEFAULT_TIMEOUT = 5000;

    var timeout = VaporAPI.data || DEFAULT_TIMEOUT;
    var Steam = VaporAPI.getSteam();
    var utils = VaporAPI.getUtils();

    // Handle 'disconnected' event
    VaporAPI.registerHandler({
            emitter: 'vapor',
            event: 'disconnected'
        },
        function(error) {
            var reason = utils.enumToString(error.eresult, Steam.EResult);

            switch(error.eresult) {
                case Steam.EResult.NoConnection:
                case Steam.EResult.ServiceUnavailable:
                case Steam.EResult.TryAnotherCM:
                    VaporAPI.emitEvent('message:info', 'Reason: ' + reason + '. Reconnecting in ' + timeout + 'ms.');
                    setTimeout(function() {
                        VaporAPI.connect();
                    }, timeout);
                    break;

                default:
                    VaporAPI.emitEvent('message:warn', 'Reason of disconnect: ' + reason);
                    break;
            }
        }
    );
};
