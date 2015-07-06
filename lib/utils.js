// Keeping Vapor instance private.
var _vapor;

/**
 * Exports Utils class.
 */
module.exports = Utils;

/**
 * Utils class constructor.
 * Instance of this class is available via {@link API#getUtils}.
 * @class
 * @param {Object} Vapor Vapor instance.
 */
function Utils(Vapor) {
    _vapor = Vapor;
}

/**
 * Returns whether a user is admin or not.
 * @param  {string}  steamID User's Steam ID.
 * @return {Boolean}         Result.
 */
Utils.prototype.isAdmin = function(steamID) {
    return !!~_vapor.config.admins.indexOf(steamID);
};

/**
 * Removes 'vapor-' prefix from plugin name.
 * @param  {string} pluginName Plugin name.
 * @return {string}            Shortened plugin name.
 */
Utils.prototype.getShortPluginName = function(pluginName) {
    if(pluginName.indexOf('vapor-') === 0)
        return pluginName.replace('vapor-', '');

    return pluginName;
};

/**
 * Returns first enum value that matches the given string.
 * @example
 * // returns 5, which is equal to Steam.EPersonaState.LookingToTrade
 * var tradeState = utils.stringToEnum("trade", Steam.EPersonaState);
 * client.setPersonaState(tradeState);
 * @param  {string} string   Enum name.
 * @param  {Object} enumList List of enums from the Steam object.
 * @return {number}          Enum value or null if not found.
 */
Utils.prototype.stringToEnum = function(string, enumList) {
    for(var key in enumList) {
        if(key.toLowerCase().indexOf(string.toLowerCase()) > -1) {
            return enumList[key];
        }
    }

    return null;
};
