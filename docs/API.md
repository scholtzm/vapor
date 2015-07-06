## Classes
<dl>
<dt><a href="#API">API</a></dt>
<dd></dd>
<dt><a href="#Utils">Utils</a></dt>
<dd></dd>
</dl>
<a name="API"></a>
## API
**Kind**: global class  

* [API](#API)
  * [new API(Vapor, pluginName)](#new_API_new)
  * [.getClient()](#API+getClient) ⇒ <code>Object</code>
  * [.getUtils()](#API+getUtils) ⇒ <code>Object</code>
  * [.getSteam()](#API+getSteam) ⇒ <code>Object</code>
  * [.getConfig()](#API+getConfig) ⇒ <code>Object</code>
  * [.emitEvent(event, data)](#API+emitEvent)
  * [.registerHandler(options, callback)](#API+registerHandler)
  * [.removeAllHandlers(options)](#API+removeAllHandlers)
  * [.getDataFolderPath()](#API+getDataFolderPath) ⇒ <code>string</code>
  * [.getLogger()](#API+getLogger) ⇒ <code>Object</code>

<a name="new_API_new"></a>
### new API(Vapor, pluginName)
API class constructor.
Instance of this class is passed to plugins exported function.


| Param | Type | Description |
| --- | --- | --- |
| Vapor | <code>Object</code> | Vapor instance. |
| pluginName | <code>string</code> | Specific plugin name which uses this API instance. |

<a name="API+getClient"></a>
### apI.getClient() ⇒ <code>Object</code>
Returns active Steam client used by Vapor.
This client is also extended by steam-groups module.

**Kind**: instance method of <code>[API](#API)</code>  
**Returns**: <code>Object</code> - Active Steam client.  
<a name="API+getUtils"></a>
### apI.getUtils() ⇒ <code>Object</code>
Returns Utils class.

**Kind**: instance method of <code>[API](#API)</code>  
**Returns**: <code>Object</code> - Instantiated Utils class.  
<a name="API+getSteam"></a>
### apI.getSteam() ⇒ <code>Object</code>
Returns Steam object.
This is useful for all the ESomething enums.

**Kind**: instance method of <code>[API](#API)</code>  
**Returns**: <code>Object</code> - Steam.  
<a name="API+getConfig"></a>
### apI.getConfig() ⇒ <code>Object</code>
Returns config for this specific plugin.

**Kind**: instance method of <code>[API](#API)</code>  
**Returns**: <code>Object</code> - Config object.  
<a name="API+emitEvent"></a>
### apI.emitEvent(event, data)
Allows plugin to emit custom events via Vapors event emitter.

**Kind**: instance method of <code>[API](#API)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | Event name. |
| data | <code>\*</code> | Data. |

<a name="API+registerHandler"></a>
### apI.registerHandler(options, callback)
Allows plugin to register custom handler for any event.

**Kind**: instance method of <code>[API](#API)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options object. |
| options.emitter | <code>string</code> | Can be either 'vapor', 'steam' or 'plugin'. |
| options.plugin | <code>string</code> | If emitter is plugin, this is plugin's name. |
| options.event | <code>string</code> | Event name. |
| callback | <code>function</code> | Callback function. |

**Example**  
```js
API.registerHandler({
        emitter: 'steam',
        event: 'friendMsg'
    },
    function(user, message, type) {
        if(type === Steam.EChatEntryType.ChatMsg) {
            log.info(user + " says: " + message);
        }
    }
);
```
<a name="API+removeAllHandlers"></a>
### apI.removeAllHandlers(options)
Allows plugin to remove all handlers for a specific event.

**Kind**: instance method of <code>[API](#API)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options object. |
| options.emitter | <code>string</code> | Can be either 'vapor', 'steam' or 'plugin'. |
| options.plugin | <code>string</code> | If emitter is 'plugin', this is plugin's name. |
| options.event | <code>string</code> | Event name. |

<a name="API+getDataFolderPath"></a>
### apI.getDataFolderPath() ⇒ <code>string</code>
Returns plugin's data folder path.

**Kind**: instance method of <code>[API](#API)</code>  
**Returns**: <code>string</code> - Full path to plugin's data folder.  
<a name="API+getLogger"></a>
### apI.getLogger() ⇒ <code>Object</code>
Returns logger prefixed with plugin's name.

**Kind**: instance method of <code>[API](#API)</code>  
**Returns**: <code>Object</code> - Logger.  
<a name="Utils"></a>
## Utils
**Kind**: global class  

* [Utils](#Utils)
  * [new Utils(Vapor)](#new_Utils_new)
  * [.isAdmin(steamID)](#Utils+isAdmin) ⇒ <code>Boolean</code>
  * [.getShortPluginName(pluginName)](#Utils+getShortPluginName) ⇒ <code>string</code>
  * [.stringToEnum(string, enumList)](#Utils+stringToEnum) ⇒ <code>number</code>

<a name="new_Utils_new"></a>
### new Utils(Vapor)
Utils class constructor.
Instance of this class is available via [getUtils](#API+getUtils).


| Param | Type | Description |
| --- | --- | --- |
| Vapor | <code>Object</code> | Vapor instance. |

<a name="Utils+isAdmin"></a>
### utils.isAdmin(steamID) ⇒ <code>Boolean</code>
Returns whether a user is admin or not.

**Kind**: instance method of <code>[Utils](#Utils)</code>  
**Returns**: <code>Boolean</code> - Result.  

| Param | Type | Description |
| --- | --- | --- |
| steamID | <code>string</code> | User's Steam ID. |

<a name="Utils+getShortPluginName"></a>
### utils.getShortPluginName(pluginName) ⇒ <code>string</code>
Removes 'vapor-' prefix from plugin name.

**Kind**: instance method of <code>[Utils](#Utils)</code>  
**Returns**: <code>string</code> - Shortened plugin name.  

| Param | Type | Description |
| --- | --- | --- |
| pluginName | <code>string</code> | Plugin name. |

<a name="Utils+stringToEnum"></a>
### utils.stringToEnum(string, enumList) ⇒ <code>number</code>
Returns first enum value that matches the given string.

**Kind**: instance method of <code>[Utils](#Utils)</code>  
**Returns**: <code>number</code> - Enum value or null if not found.  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | Enum name. |
| enumList | <code>Object</code> | List of enums from the Steam object. |

**Example**  
```js
// returns 5, which is equal to Steam.EPersonaState.LookingToTrade
var tradeState = utils.stringToEnum("trade", Steam.EPersonaState);
client.setPersonaState(tradeState);
```
