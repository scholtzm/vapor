<a name="Utils"></a>
## Utils
**Kind**: global class  

* [Utils](#Utils)
  * [new Utils(Vapor)](#new_Utils_new)
  * [.isAdmin(steamID)](#Utils+isAdmin) ⇒ <code>Boolean</code>
  * [.getShortPluginName(pluginName)](#Utils+getShortPluginName) ⇒ <code>string</code>

<a name="new_Utils_new"></a>
### new Utils(Vapor)
Utils class constructor.


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

