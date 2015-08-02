<a name="Vapor"></a>
## Vapor
**Kind**: global class  

* [Vapor](#Vapor)
  * [new Vapor()](#new_Vapor_new)
  * [.init(config)](#Vapor+init)
  * [.use(pluginName, plugin, data)](#Vapor+use)
  * [.connect()](#Vapor+connect)
  * [.disconnect()](#Vapor+disconnect)

<a name="new_Vapor_new"></a>
### new Vapor()
Main Vapor class.

Instance of this class is never created manually.

**Example**  
```js
var vapor = require('vapor');
var bot = vapor();
```
<a name="Vapor+init"></a>
### vapor.init(config)
Initializes Vapor instance.

Properties:
* `username` - username used for logging in
* `password` - password used for logging in
* `displayName` - this is the name everyone else sees
* `state` - initial online statusCode
* `admins` - array of SteamID64 strings
* `logs` - settings used by the logger
* `logs.dateFormat` - date format used by the logger
* `logs.consoleLevel` - logger level used in the console
* `logs.fileLevel` - logger level used in the file
* `dataDir` - path to directory that will be used to store data such as logs, sentry files etc.

**Kind**: instance method of <code>[Vapor](#Vapor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Configuration object. |

**Example**  
```js
// Example config object
// All properties are required
// This can be loaded from JSON file of course
var config = {
    username: 'myUsername',
    password: 'myPassword',
    displayName: 'Bot Name',
    state: 'Online',
    admins: [ '7656123456', '7656987654' ],
    logs: {
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        consoleLevel: 'debug',
        fileLevel: 'debug'
    },
    dataDir: './data'
};
```
<a name="Vapor+use"></a>
### vapor.use(pluginName, plugin, data)
Vapor's plugin loader.

**Kind**: instance method of <code>[Vapor](#Vapor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pluginName | <code>string</code> | Plugin's unique identifier. |
| plugin | <code>function</code> | Main plugin function. |
| data | <code>\*</code> | Extra data passed to VaporAPI. If you need multiple values, use object. |

<a name="Vapor+connect"></a>
### vapor.connect()
Connects Vapor to Steam network.

**Kind**: instance method of <code>[Vapor](#Vapor)</code>  
<a name="Vapor+disconnect"></a>
### vapor.disconnect()
Disconnects Vapor from Steam network.

**Kind**: instance method of <code>[Vapor](#Vapor)</code>  
