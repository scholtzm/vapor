# Vapor Example - No Swearing

Example of custom plugin which will warn or kick the user (non-admin) if he uses a swear word.

Notice how the `Vapor.use` method allows to pass optional data object which holds configuration. `no-swearing-plugin.js` then accesses this data via `VaporAPI.data`.

This example was originally in the Wiki.

### Usage

```sh
VAPOR_USER=username VAPOR_PASS=password VAPOR_ADMIN=steamID64 node index.js
```

Replace `username`, `password` and `steamID64` with real values.
