[![NPM version](http://img.shields.io/npm/v/vapor.svg?style=flat)](https://www.npmjs.org/package/vapor)
[![Build Status](https://travis-ci.org/scholtzm/vapor.svg?branch=master)](https://travis-ci.org/scholtzm/vapor)
[![Dependency Status](https://david-dm.org/scholtzm/vapor.svg)](https://david-dm.org/scholtzm/vapor)
[![devDependency Status](https://david-dm.org/scholtzm/vapor/dev-status.svg)](https://david-dm.org/scholtzm/vapor#info=devDependencies)

# Vapor

> Lightweight [Steam](http://store.steampowered.com/about/) client framework for node.js.

![vapor](https://cloud.githubusercontent.com/assets/2640934/9032860/1cf00bb8-39c3-11e5-82a0-efe2807c8f62.png)

## Install

```sh
npm install vapor
```

## Usage

```js
var vapor = require('vapor');

var bot = vapor();
bot.init({
    username: 'myUsername',
    password: 'myPassword'
});
bot.connect();
```

## About

Vapor is a lightweight Steam client framework for node.js which provides unified API for writing custom extensions. Vapor takes care of the basic stuff such as maintaining connection, logging in or providing console and file logger and exposes simple API which allows custom plugins to extend its behaviour.

This concept is very similar to [Stem](https://github.com/alvinl/stem), however the main difference is, that Vapor is not a standalone application but rather a framework.

## Client

Vapor provides a very simple automated client. This client uses [node-steam](https://github.com/seishun/node-steam) to connect to Steam servers.

Vapor represents several key features:
- easy to update and does not have to be modified by the user
- handles log in process, including auth codes and sentry files
- provides API for plugins
- makes it possible to run multiple bots using a single installation
- provides a bunch of [built-in plugins](docs) to make your life easier

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

Examples are provided in the [examples](examples) folder.

You can also find auto-generated API docs in the [docs](docs) folder.

## LICENSE

MIT. See `LICENSE`.
