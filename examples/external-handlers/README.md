# Vapor Example - External Handler

Vapor provides only a bunch of handlers out of the box. Any other handler has to be instantiated manually in your own code. This particular example shows to use [node-steam](https://github.com/seishun/node-steam)'s [`SteamGameCoordinator`](https://github.com/seishun/node-steam/tree/master/lib/handlers/game_coordinator) handler with Vapor.

### Usage

```sh
VAPOR_USER=username VAPOR_PASS=password node index.js
```

Replace `username` and `password` with real values.
