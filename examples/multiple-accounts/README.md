# Vapor Example - Multiple accounts

This example shows the possibility of running multiple Vapor instances.

Couple interesting things to notice:
* log messages are prefixed with bot's username - see config
* bots start in chain - this way, we can still easily enter the SteamGuard code for each bot
* chain loading uses the vapor `ready` event

### Usage

```sh
VAPOR_USER1=username1 VAPOR_PASS1=password1 VAPOR_USER2=username2 VAPOR_PASS2=password2 node index.js
```

Replace `usernameX` and `passwordX` with real values.
