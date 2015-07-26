# Vapor Events

Vapor emits events and any plugin can register appropriate callback function.

Event | Callback arguments | Description
----- | ---- | -----------
ready | - | Vapor has completely logged into Steam network.
cookies | cookies | Array of cookies provided by Steam's `ISteamUserAuth/AuthenticateUser/v1` web API method. This event is emitted automatically by Vapor after successful login. This functionality was previously provided by node-steam's `webLogOn` method.
