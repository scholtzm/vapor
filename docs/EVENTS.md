# Vapor Events

Vapor emits events and any plugin can register appropriate callback function.

There are built-in plugins for some of these events. The list of built-in plugins can be found here: [BUILT-IN-PLUGINS.md](BUILT-IN-PLUGINS.md)

### cookies
* `cookies` - An array of strings in `key=value` format.
* `sessionid` - String containing session ID.

Cookies provided by Steam's `ISteamUserAuth/AuthenticateUser/v1` web API method. This event is emitted automatically by Vapor after successful login. This functionality was previously provided by node-steam's `webLogOn` method. You can also manually trigger this event by calling [API.webLogon](API.md#API+webLogOn) from your plugin.

*Example:*

```js
VaporAPI.registerHandler({
  emitter: 'vapor',
  event: 'cookies'
}, function(cookies, sessionid) {
  // Do something with cookies and sessionid
});
```

### disconnected
* `error` - An `Error` object.

This event is emitted when we get disconnected either by Steam servers going down or because of a login error.

Error properties:
* `eresult` - Value corresponding to Steam's EResult enum.

*Example:*

```js
var Steam = VaporAPI.getSteam();

VaporAPI.registerHandler({
  emitter: 'vapor',
  event: 'disconnected'
}, function(error) {
  if(error.eresult === Steam.EResult.NoConnection) {
    // Reconnect in 5 seconds
    setTimeout(function() { VaporAPI.connect(); }, 5000);
  }
});
```

### loginKey
* `loginKey` - String containing your login key.

You can use this login key for subsequent logins in place of password.

*Example:*

```js
VaporAPI.registerHandler({
  emitter: 'vapor',
  event: 'loginKey'
}, function(loginKey) {
  // Save the login key somewhere
});
```

### message:*
* `messageText` - Message. *Duh!*

*Concrete event types:*
* `message:debug` - Used for debug messages.
* `message:info` - Used for info messages.
* `message:warn` - Used for warning messages.
* `message:error` - Used for error messages.

Vapor does lots of stuff automatically. To let you know about different events being handled, Vapor will emit `message:*` events.

All Vapor built-in plugins adhere to this convention and they also emit these events when necessary.

*Example:*

```js
// Log all info messages to console
VaporAPI.registerHandler({
  emitter: '*',
  // Same for debug, warn and error
  event: 'message:info'
}, function(messageText) {
  console.log(messageText);
});
```

*Built-in-plugin available:* [console-logger](BUILT-IN-PLUGINS.md#module_console-logger)

### readFile
* `fileName` - File identifier.
* `callback` - Callback function to be called after the data is retrieved.
  * `error` - Error, if the read operation fails.
  * `data` - Data received from the read operation.

Emitted whenever Vapor needs to read a file, e.g. SteamGuard sentry file.
This event allows you to implement your own storage - file system, database, etc.

*Example:*

```js
VaporAPI.registerHandler({
  emitter: 'vapor',
  event: 'readFile'
}, function(fileName, callback) {
  // This is probably the most simple
  // 'readFile' handler one can make
  require('fs').readFile(filename, callback);
});
```

*Built-in-plugin available:* [fs](BUILT-IN-PLUGINS.md#module_fs)

### ready

Vapor has completely logged into Steam network.

*Example:*

```js
VaporAPI.registerHandler({
  emitter: 'vapor',
  event: 'ready'
}, function() {
  // Do something
});
```

### steamGuard
* `callback` - A callback function.
  * `code` - Should be your SteamGuard auth code.

After you retrieve the auth code, call `callback` with the auth code as the only argument. Check out `custom-steamguard` example to see how this works.

*Example:*

```js
VaporAPI.registerHandler({
  emitter: 'vapor',
  event: 'steamGuard'
}, function(callback) {
  // 'getFromEmail' would be your custom function
  // to retrieve the auth code automatically
  var code = getFromEmail();
  callback(code);
});
```

*Built-in-plugin available:* [stdin-steamguard](BUILT-IN-PLUGINS.md#module_stdin-steamguard)

### writeFile
* `fileName` - File identifier.
* `data` - Data to be persisted.
* `callback` - Callback function to be called after the data is persisted.
  * `error` - Error, if the write operation fails.

Emitted whenever Vapor needs to persist a file, e.g. SteamGuard sentry file.
This event allows you to implement your own storage - file system, database, etc.

*Example:*

```js
VaporAPI.registerHandler({
  emitter: 'vapor',
  event: 'writeFile'
}, function(fileName, data, callback) {
  require('fs').writeFile(filename, data, callback);
});
```

*Built-in-plugin available:* [fs](BUILT-IN-PLUGINS.md#module_fs)
