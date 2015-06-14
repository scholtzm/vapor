module.exports = Utils;

function Utils(Vapor) {
    this.vapor = Vapor;
}

Utils.prototype.isAdmin = function(steamID) {
    return !!~this.vapor.config.admins.indexOf(steamID);
};

Utils.prototype.getShortPluginName = function(pluginName) {
    if(pluginName.indexOf('vapor-') === 0)
        return pluginName.replace('vapor-', '');

    return pluginName;
};
