<p align="center">
  <a href="http://github.com/flyjs">
    <img width=280px src="https://cloud.githubusercontent.com/assets/2640934/10439290/2a3aede4-7139-11e5-88c3-5ceed9b80a0f.png">
  </a>
  <br>
  <i>"Lightweight <a href="http://store.steampowered.com/about/">Steam</a> client framework for node.js"</i>
</p>

---

<p align="center">
  <a href="https://www.npmjs.org/package/vapor">
    <img src="http://img.shields.io/npm/v/vapor.svg?style=flat" alt="NPM version">
  </a>

  <a href="https://travis-ci.org/scholtzm/vapor">
    <img src="https://travis-ci.org/scholtzm/vapor.svg?branch=master" alt="Build Status">
  </a>

  <a href="https://david-dm.org/scholtzm/vapor">
    <img src="https://david-dm.org/scholtzm/vapor.svg" alt="Dependency Status">
  </a>

  <a href="https://david-dm.org/scholtzm/vapor#info=devDependencies">
    <img src="https://david-dm.org/scholtzm/vapor/dev-status.svg" alt="devDependency Status">
  </a>

  <a href="https://gitter.im/scholtzm/vapor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge">
    <img src="https://badges.gitter.im/Join%20Chat.svg" alt="Gitter">
  </a>
</p>

---

## About

Vapor is a lightweight Steam client framework for [node.js](https://github.com/nodejs/node) which provides unified API for writing custom extensions. Vapor takes care of the basic stuff such as maintaining connection, logging in and exposes simple API which allows custom plugins to extend its behaviour.

## Install

```sh
npm install vapor
```

## Usage

```js
var vapor = require('vapor');

var bot = vapor();
bot.init({username: 'myUsername', password: 'myPassword'});
bot.connect();
```

## Client

Vapor provides a very simple automated client. This client uses [node-steam](https://github.com/seishun/node-steam) to connect to Steam servers.

Vapor represents several key features:
- easy to update and does not have to be modified by the user
- handles log in process, including auth codes and sentry files
- provides API for plugins
- provides unified logging interface
- makes it possible to run multiple bots using a single installation
- provides a bunch of [built-in plugins](docs) to make your life easier

Everything else needs to be programmed separately using plugin system.

## Plugins

Plugins are self-contained code snippets which extend Vapor's behaviour.

Plugins have:
- access to active Steam client instance and handlers
- access to Steam's enums

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
