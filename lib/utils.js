var Long = require('long');
var moment = require('moment');

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
    this._vapor = Vapor;
}

/**
 * Returns whether a user is admin or not.
 * @param  {string}  steamID User's Steam ID.
 * @return {Boolean}         Result.
 */
Utils.prototype.isAdmin = function(steamID) {
    return this._vapor._config.admins.indexOf(steamID) > -1;
};

/**
 * Returns easy-to-read user description.
 *
 * Format allows placeholders:
 * * `%username` - for Steam username
 * * `%steamid64` - for 64 bit SteamID
 * * `%accountid` - for account ID
 * @param  {string} steamID  User's Steam ID.
 * @param  {string} format - Format string.
 * @return {string}          User's description.
 */
Utils.prototype.getUserDescription = function(steamID, format) {
    format = format || '%username (%steamid64)';
    var result = format;

    // %username (if possible)
    if(steamID in this._vapor._steamFriends.personaStates) {
        result = result.replace('%username', this._vapor._steamFriends.personaStates[steamID].player_name);
    } else {
        result = result.replace('%username', '[unknown]');
    }

    // %steamid64
    result = result.replace('%steamid64', steamID);

    // %accountid
    result = result.replace('%accountid', this.steamIDToAccountID(steamID));

    return result;
};

/**
 * Returns first enum value that matches the given string.
 * @example
 * // returns 5, which is equal to Steam.EPersonaState.LookingToTrade
 * var tradeState = utils.stringToEnum("trade", Steam.EPersonaState);
 * steamFriends.setPersonaState(tradeState);
 * @param  {string} string   Enum name.
 * @param  {Object} enumList List of enums from the Steam object.
 * @return {number}          Enum value or null if not found.
 */
Utils.prototype.stringToEnum = function(string, enumList) {
    for(var key in enumList) {
        if(key.toLowerCase().indexOf(string.replace(/\s/g, '').toLowerCase()) > -1) {
            return enumList[key];
        }
    }

    return null;
};

/**
 * Returns string description for the given enum value.
 * @example
 * // returns "LookingToTrade"
 * var stateDescription = utils.stringToEnum(5, Steam.EPersonaState);
 * @param  {number} value    Enum value.
 * @param  {Object} enumList List of enums from the Steam object.
 * @return {string}          Enum string description or null if not found.
 */
Utils.prototype.enumToString = function(value, enumList) {
    for(var key in enumList) {
        if(enumList[key] === value) {
            return key;
        }
    }

    return null;
};

/**
 * Converts account ID to 64 bit SteamID string.
 * @param  {number} accountID User's account ID.
 * @return {string}           Converted 64 bit SteamID.
 */
Utils.prototype.accountIDToSteamID = function(accountID) {
    return new Long(accountID, 0x1100001).toString();
};

/**
 * Converts 64 bit SteamID string to account ID.
 * @param  {string} steamID 64 bit SteamID.
 * @return {number}         Account ID.
 */
Utils.prototype.steamIDToAccountID = function(steamID) {
    return new Long.fromString(steamID).toInt();
};

/**
 * Converts unix timestamp into formatted timestamp.
 * @param  {number} unixTimestamp Unix timestamp.
 * @param  {string} format      - Timestamp format.
 * @return {string}               Formatted timestamp.
 */
Utils.prototype.getTimestamp = function(unixTimestamp, format) {
    var defaultFormat = 'YYYY-MM-DD HH:mm:ss';
    return moment.unix(unixTimestamp).format(format || defaultFormat);
};
