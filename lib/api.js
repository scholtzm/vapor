var util = require('util');

var SEPARATOR = ':';
var GLOBAL_EVENT_EMITTER = '*';

// Private method to generate event names for plugins.
function _getPluginEventName(plugin, event) {
  return plugin + SEPARATOR + event;
}

// Private function to create shortened plugin name
function _getShortPluginName(pluginName) {
  if(pluginName.indexOf('vapor-') === 0) {
    return pluginName.replace('vapor-', '');
  }

  return pluginName;
}

/**
 * Exports API class.
 */
module.exports = API;

/**
 * API class constructor.
 *
 * Instance of this class is passed to plugins exported function as the only argument.
 * @class
 * @typicalname api
 * @param    {Vapor}  vapor      Vapor instance.
 * @param    {string} pluginName Specific plugin name which uses this API instance.
 * @param    {Object} data       Data object that is passed to API instance.
 * @property {string} pluginName Name of the plugin which uses this specific API instance.
 * @property {Object} data       Data object that is passed to API instance via `Vapor.use` method.
 */
function API(vapor, pluginName, data) {
  // Private properties
  this._vapor = vapor;

  // Public properties
  this.pluginName = pluginName;
  this.data = data;
}

/**
 * Connect to Steam network.
 */
API.prototype.connect = function() {
  this._vapor.connect();
};

/**
 * Disconnect from Steam network.
 */
API.prototype.disconnect = function() {
  this._vapor.disconnect();
};

/**
 * Returns active Steam client used by Vapor.
 * @return {SteamClient} Active Steam client.
 */
API.prototype.getClient = function() {
  return this._vapor._client;
};

/**
 * Returns active Steam handler used by Vapor.
 * @param  {string} handler Can be either `steamUser`, `steamFriends`, `steamTrading` or `steamGroups`.
 * @return {Object}         Active Steam handler.
 */
API.prototype.getHandler = function(handler) {
  switch (handler) {
    case 'steamUser':
      return this._vapor._steamUser;
    case 'steamFriends':
      return this._vapor._steamFriends;
    case 'steamTrading':
      return this._vapor._steamTrading;
    case 'steamGroups':
      return this._vapor._steamGroups;
    default:
      throw new Error('Unknown handler ' + handler + ' in "getHandler" method.');
  }
};

/**
 * Returns instance of Utils class.
 * @return {Utils} Instantiated Utils class.
 */
API.prototype.getUtils = function() {
  return this._vapor._utils;
};

/**
 * Returns Steam object.
 *
 * This is especially useful for all the ESomething enums.
 * @return {Steam} Steam.
 */
API.prototype.getSteam = function() {
  return this._vapor._Steam;
};

/**
 * Returns Vapor config object.
 * @return {Object} Config object.
 */
API.prototype.getConfig = function() {
  return this._vapor._config;
};

/**
 * Returns array of names of loaded plugins.
 * @return {string[]} Array of plugin names.
 */
API.prototype.getPlugins = function() {
  return this._vapor._loadedPlugins;
};

/**
 * Allows plugin to emit custom events via Vapor's event emitter.
 *
 * This function allows to pass multiple data arguments.
 *
 * Also see {@link API#registerHandler}.
 * @example
 * API.emitEvent('myCustomPluginEvent', someString, someObject);
 * @param  {string} event Event name.
 * @param  {...*}   args  Data arguments.
 */
API.prototype.emitEvent = function() {
  var args = Array.prototype.slice.call(arguments);
  var original = args[0];

  args[0] = _getPluginEventName(this.pluginName, args[0]);
  this._vapor.emit.apply(this._vapor, args);

  // Plugin event also needs to be emitted as global event
  args[0] = original;
  args[0] = _getPluginEventName(GLOBAL_EVENT_EMITTER, args[0]);
  this._vapor.emit.apply(this._vapor, args);
};

/**
 * Allows plugin to register custom handler for any event.
 *
 * Also see {@link API#emitEvent}.
 * @example
 * // Listen to 'friendMsg' event emitted by 'steamFriends'
 * API.registerHandler({
 *   emitter: 'steamFriends',
 *   event: 'friendMsg'
 * }, function(user, message, type) {
 *   if(type === Steam.EChatEntryType.ChatMsg) {
 *     onsole.log(user + " says: " + message);
 *   }
 * });
 *
 * // Listen to another plugin's custom event
 * API.registerHandler({
 *   emitter: 'plugin',
 *   plugin: 'another-plugin-name'
 *   event: 'myCustomPluginEvent'
 * }, function(someString, someObject) {
 *   console.log(someString, someObject);
 * });
 *
 * // Listen to any 'debug' event
 * API.registerHandler({
 *   emitter: '*',
 *   event: 'debug'
 * }, function() {
 *   console.log(arguments);
 * });
 *
 * @param  {Object}    options          Options object.
 * @param  {string}    options.emitter  Can be either `vapor`, `client`, `steamUser`,
 * `steamFriends`, `steamTrading`, `plugin` or `*` (which stands for 'any').
 * @param  {string}    options.plugin - If emitter is `plugin`, this is plugin's name. Use `*` for any.
 * @param  {string}    options.event    Event name.
 * @param  {function}  callback         Callback function.
 */
API.prototype.registerHandler = function(options, callback) {
  if(options.emitter === 'plugin' && !options.plugin) {
    throw new Error('Missing "plugin" property in options in "registerHandler" method.');
  }

  if(typeof callback !== 'function') {
    throw new Error('Callback must be a function.');
  }

  var vapor = this._vapor;

  switch(options.emitter) {
    case 'vapor':
      vapor.on(options.event, callback);
      break;

    case 'client':
      vapor._client.on(options.event, callback);
      break;

    case 'steamUser':
      vapor._steamUser.on(options.event, callback);
      break;

    case 'steamFriends':
      vapor._steamFriends.on(options.event, callback);
      break;

    case 'steamTrading':
      vapor._steamTrading.on(options.event, callback);
      break;

    case 'plugin':
      var eventName = _getPluginEventName(options.plugin, options.event);
      vapor.on(eventName, callback);
      break;

    case GLOBAL_EVENT_EMITTER:
      vapor.on(options.event, callback);
      vapor._client.on(options.event, callback);
      vapor._steamUser.on(options.event, callback);
      vapor._steamFriends.on(options.event, callback);
      vapor._steamTrading.on(options.event, callback);

      // global plugin event name
      var globalEventName = _getPluginEventName(GLOBAL_EVENT_EMITTER, options.event);
      vapor.on(globalEventName, callback);

      break;

    default:
      throw new Error('Unknown event emitter ' + options.emitter + ' in "registerHandler" method.');
  }
};

/**
 * Returns true if there is at least one handler for the given event, false otherwise.
 * @example
 * if(API.hasHandler({emitter: 'steamFriends', event: 'friendMsg'})) {
 *   // do something ...
 * }
 *
 * if(API.hasHandler('readFile')) {
 *   // we can safely emit this event to read a file
 * }
 * @param  {Object|string}    options   Options object or event name.
 * @param  {string}    options.emitter          Can be either `vapor`, `client`, `steamUser`,
 * `steamFriends`, `steamTrading`, `plugin` or `*` (which stands for 'any').
 * @param  {string}    options.plugin -         If emitter is `plugin`, this is plugin's name. Use `*` for any.
 * @param  {string}    options.event            Event name.
 */
API.prototype.hasHandler = function(options) {
  if(typeof options === 'string') {
    // concrete
    return this.hasHandler({emitter: 'plugin', plugin: this.pluginName, event: options}) ||
    // any plugin
    this.hasHandler({emitter: 'plugin', plugin: '*', event: options}) ||
    // any emitter
    this.hasHandler({emitter: '*', event: options});
  }

  if(options.emitter === 'plugin' && !options.plugin) {
    throw new Error('Missing "plugin" property in options in "hasHandlers" method.');
  }

  var vapor = this._vapor;

  switch(options.emitter) {
    case 'vapor':
      return vapor.listeners(options.event).length > 0;

    case 'client':
      return vapor._client.listeners(options.event).length > 0;

    case 'steamUser':
      return vapor._steamUser.listeners(options.event).length > 0;

    case 'steamFriends':
      return vapor._steamFriends.listeners(options.event).length > 0;

    case 'steamTrading':
      return vapor._steamTrading.listeners(options.event).length > 0;

    case 'plugin':
      var eventName = _getPluginEventName(options.plugin, options.event);
      return vapor.listeners(eventName).length > 0;

    case GLOBAL_EVENT_EMITTER:
      var total = 0;

      total += vapor.listeners(options.event).length;
      total += vapor._client.listeners(options.event).length;
      total += vapor._steamUser.listeners(options.event).length;
      total += vapor._steamFriends.listeners(options.event).length;
      total += vapor._steamTrading.listeners(options.event).length;

      // global plugin event name
      var globalEventName = _getPluginEventName(GLOBAL_EVENT_EMITTER, options.event);
      total += vapor.listeners(globalEventName).length;

      return total > 0;

    default:
      throw new Error('Unknown event emitter ' + options.emitter + ' in "registerHandler" method.');
  }
};

/**
 * Allows plugin to remove all handlers for a specific event.
 * @param  {Object}  options          Options object.
 * @param  {string}  options.emitter  Can be either `vapor`, `client`, `steamUser`,
 * `steamFriends`, `steamTrading`, `plugin` or `*` (which stands for 'any').
 * @param  {string}  options.plugin - If emitter is `plugin`, this is plugin's name. Use `*` for any.
 * @param  {string}  options.event    Event name.
 */
API.prototype.removeAllHandlers = function(options) {
  if(options.emitter === 'plugin' && !options.plugin) {
    throw new Error('Missing "plugin" property in options in "removeAllHandlers" method.');
  }

  var vapor = this._vapor;

  switch(options.emitter) {
    case 'vapor':
      vapor.removeAllListeners(options.event);
      break;

    case 'client':
      vapor._client.removeAllListeners(options.event);
      break;

    case 'steamUser':
      vapor._steamUser.removeAllListeners(options.event);
      break;

    case 'steamFriends':
      vapor._steamFriends.removeAllListeners(options.event);
      break;

    case 'steamTrading':
      vapor._steamTrading.removeAllListeners(options.event);
      break;

    case 'plugin':
      var eventName = _getPluginEventName(options.plugin, options.event);
      vapor.removeAllListeners(eventName);
      break;

    case GLOBAL_EVENT_EMITTER:
      vapor.removeAllListeners(options.event);
      vapor._client.removeAllListeners(options.event);
      vapor._steamUser.removeAllListeners(options.event);
      vapor._steamFriends.removeAllListeners(options.event);
      vapor._steamTrading.removeAllListeners(options.event);

      // global plugin event name
      var globalEventName = _getPluginEventName(GLOBAL_EVENT_EMITTER, options.event);
      vapor.removeAllListeners(globalEventName);

      break;

    default:
      throw new Error('Unknown event emitter ' + options.emitter + ' in "removeAllHandlers" method.');
  }
};

/**
 * Returns wrapper for emitting 'message:*' events prefixed with plugin's name.
 *
 * Available levels:
 * * log.debug
 * * log.info
 * * log.warn
 * * log.error
 * @example
 * var log = VaporAPI.getLogger();
 *
 * log.info('This is a regular info message...');
 * log.warn('...and this is a warning message.');
 * log.debug('String %s works too!', 'formatting');
 * @return {Object} Logger.
 */
API.prototype.getLogger = function() {
  var self = this;
  var name = _getShortPluginName(this.pluginName);

  function filter(args, level) {
    var message = util.format.apply(util.format, args);
    self.emitEvent('message:' + level, '[' + name + '] ' + message);
  }

  // This is quite ugly.
  return {
    debug: function() {
      filter(arguments, 'debug');
    },
    info: function() {
      filter(arguments, 'info');
    },
    warn: function() {
      filter(arguments, 'warn');
    },
    error: function() {
      filter(arguments, 'error');
    }
  };
};

/**
 * Calls Vapor's internal webLogOn method.
 *
 * Listen to `cookies` event to receive new array of cookies and sessionid.
 *
 * You should call this function ONLY if you believe cookies have expired, e.g.
 * you logged into your account from another IP / browser and you are getting
 * HTTP 403 etc.
 *
 * You do NOT have to call this method on startup as it's automatically called
 * by Vapor after successfully logging in.
 */
API.prototype.webLogOn = function() {
  var vapor = this._vapor;

  vapor._steamUser.requestWebAPIAuthenticateUserNonce(function(nonce) {
    vapor._webLogOn(nonce.webapi_authenticate_user_nonce);
  });
};
