module.exports = Utils;

function Utils(Vapor) {
    this.vapor = Vapor;
}

Utils.prototype.isAdmin = function(steamID) {
    return !!~this.vapor.config.admins.indexOf(steamID);
};
