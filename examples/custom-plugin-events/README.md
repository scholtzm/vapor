# Vapor Example - Custom Plugin Events

Examples of cross-plugin communication using custom events. Notice the importance of plugin names which are used to identify the event emitter.

First example (`index1.js`) shows one plugin emitting events for another plugin to listen to.

Second example (`index2.js`) shows how plugins can provide internal resources for other plugins to consume.

### Usage

```sh
VAPOR_USER=username VAPOR_PASS=password node index1.js
# or
VAPOR_USER=username VAPOR_PASS=password node index2.js
```

Replace `username` and `password` with real values.
