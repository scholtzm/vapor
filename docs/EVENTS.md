# Vapor Events

Vapor emits events and any plugin can register appropriate callback function.

Example:

```js
VaporAPI.registerHandler({
        emitter: 'vapor',
        event: 'cookies'
    },
    function(cookies, sessionid) {
        // Do something with cookies and sessionid
    }
);
```

### cookies
* `cookies` - An array of strings in `key=value` format.
* `sessionid` - String containing session ID.

Cookies provided by Steam's `ISteamUserAuth/AuthenticateUser/v1` web API method. This event is emitted automatically by Vapor after successful login. This functionality was previously provided by node-steam's `webLogOn` method. You can also manually trigger this event by calling [API.webLogon](API.md#API+webLogOn) from your plugin.

### error
* `error` - An `Error` object.

This event is emitted when we get disconnected either by Steam servers going down or because of a login error.

Error properties:
* `eresult` - Value corresponding to Steam's EResult enum.

*There's also a built-in plugin which will automatically reconnect Vapor client if the Steam servers are down.*

### ready

Vapor has completely logged into Steam network.

### steamGuard
* `callback` - A callback function.
  * `code` - Should be your SteamGuard auth code.

After you retrieve the auth code, call `callback` with the auth code as the only argument. Check out `custom-steamguard` example to see how this works.

*There's also a built-in plugin which will read this code from standard input.*
