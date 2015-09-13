# Vapor Events

Vapor emits events and any plugin can register appropriate callback function.

Event | Callback arguments | Description
----- | ---- | -----------
`cookies` | cookies | Array of cookies provided by Steam's `ISteamUserAuth/AuthenticateUser/v1` web API method. This event is emitted automatically by Vapor after successful login. This functionality was previously provided by node-steam's `webLogOn` method. You can also manually trigger this event by calling [API.webLogon](https://github.com/scholtzm/vapor/blob/master/docs/API.md#API+webLogOn).
`error` | error | This event is emitted when we get disconnected either by Steam servers going down or because of a login error. `error` object will contain `cause` property. There's also a built-in plugin which will automatically reconnect Vapor client if the Steam servers are down.
`ready` | - | Vapor has completely logged into Steam network.
`steamGuard` | callback | After you retrieve the auth code, call `callback` with the auth code as the only argument. Check out `custom-steamguard` example to see how this works. There's also a built-in plugin which will read this code from standard input.
