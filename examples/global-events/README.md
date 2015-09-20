# Vapor Example - Global Events

This example demonstrates the possibility to register handler for events emitted globally by any of the Vapor's emitters or other external plugins.

```js
// Register handler for 'eventName' emitted by any emitter
API.registerHandler({
        emitter: '*',
        event: 'eventName'
    },
    function() {
        // Do something ...
    }
);

// Register handler for 'eventName' emitted by any plugin
API.registerHandler({
        emitter: 'plugin',
        plugin: '*'
        event: 'eventName'
    },
    function() {
        // Do something ...
    }
);
```

### Usage

```sh
VAPOR_USER=username VAPOR_PASS=password node index.js
```

Replace `username` and `password` with real values.
