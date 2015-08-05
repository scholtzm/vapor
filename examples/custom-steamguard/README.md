# Vapor Example - Custom SteamGuard

This example demonstrates the possibility of plugging in a custom function which handles SteamGuard code retrieval automatically. Well, almost... :grinning:

Once you have this example running, it will end with login error. This is correct since the auth code provided directly in the code is expected to fail.

### Usage

```sh
VAPOR_USER=username VAPOR_PASS=password node index.js
```

Replace `username` and `password` with real values.
