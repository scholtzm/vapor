[![Dependency Status](https://david-dm.org/scholtzm/vapor.svg)](https://david-dm.org/scholtzm/vapor)
[![devDependency Status](https://david-dm.org/scholtzm/vapor/dev-status.svg)](https://david-dm.org/scholtzm/vapor#info=devDependencies)

# Vapor

> Automated extensible [Steam](http://store.steampowered.com/about/) client for node.js.

![vapor](https://cloud.githubusercontent.com/assets/2640934/8464564/6946c9be-2043-11e5-9189-d5fe5e334c88.png)

## About

Vapor is lightweight Steam client for node.js which provides unified API for writing custom extensions. Vapor takes care of the basic stuff such as maintaining connection, logging in or logging of all the major Steam events and exposes simple API which allows custom plugins to extend its behaviour.

This concept is very similar to [Stem](https://github.com/alvinl/stem), however the plugin system is slightly different.

## Client

Vapor's core (represented by this repo) provides a very simple automated client. This client uses [node-steam](https://github.com/seishun/node-steam) to connect to Steam servers.

Core represents several key features:
- easy to update and does not have to be modified by the user
- handles log in process, including auth codes and sentry files
- logs major Steam events to console and file
- provides API for plugins
- makes it possible to run multiple bots using a single installation

Everything else needs to be programmed separately using plugin system.

## Plugins

Plugins are self-contained code snippets which extend Vapor's behaviour.

Plugins have:
- access to active Steam client instance and handlers
- access to Steam's enums
- access to logger

They can:
- emit custom events
- listen to events
- have their own configuration
- store data
- and more ...

Using this pattern, there are no hard dependencies between two plugins. If a plugin listens to another plugins event, the plugin won't break even if the other plugin isn't available.

## More information

Visit this repo's Wiki for more information regarding installation, configuration, API, plugins, etc.

You can also find auto-generated API docs in the [docs](docs) folder.

## LICENSE

MIT. See `LICENSE`.
