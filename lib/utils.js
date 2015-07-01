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
    this.vapor = Vapor;
}

/**
 * Returns whether a user is admin or not.
 * @param  {string}  steamID User's Steam ID.
 * @return {Boolean}         Result.
 */
Utils.prototype.isAdmin = function(steamID) {
    return !!~this.vapor.config.admins.indexOf(steamID);
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
