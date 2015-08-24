# Vapor Events

Vapor emits events and any plugin can register appropriate callback function.

Event | Callback arguments | Description
----- | ---- | -----------
`cookies` | cookies | Array of cookies provided by Steam's `ISteamUserAuth/AuthenticateUser/v1` web API method. This event is emitted automatically by Vapor after successful login. This functionality was previously provided by node-steam's `webLogOn` method. You can also manually trigger this event by calling [API.webLogon](https://github.com/scholtzm/vapor/blob/master/docs/API.md#API+webLogOn).
`error` | error | This event is emitted when login fails, e.g. due to incorrect password or SteamGuard code. In this case the error object also contains the complete login response received from Steam. This event is also emitted if the auth code reading from standard input fails.
`ready` | - | Vapor has completely logged into Steam network.
`steamGuard` | callback | After you retrieve the auth code, call `callback` with the auth code as the only argument. This event will fire _only_ if you set config property `stdinSteamGuard` to `false`. Check out `custom-steamguard` example to see how this works.
