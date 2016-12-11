## Modules

<dl>
<dt><a href="#module_account-flags">account-flags</a></dt>
<dd><p>Logs account flags to console after successfully logging in.</p>
<p>This plugin is mostly useful for debugging and development.</p>
</dd>
<dt><a href="#module_admins">admins</a></dt>
<dd><p>Provides whitelist-like functionality for recognizing admin accounts.</p>
<p>This plugin replaces built-in admins system.</p>
</dd>
<dt><a href="#module_auto-reconnect">auto-reconnect</a></dt>
<dd><p>Automatically reconnects to Steam network if:</p>
<ul>
<li>we get disconnected (eresult <code>NoConnection</code>)</li>
<li>we receive <code>ServiceUnavailable</code> or <code>TryAnotherCM</code> after logging in</li>
</ul>
<p>Any other case is ignored.</p>
</dd>
<dt><a href="#module_auto-responder">auto-responder</a></dt>
<dd><p>Automatically responds to any chat message with a predefined response.</p>
<p>Response is required to load this plugin.</p>
</dd>
<dt><a href="#module_console-logger">console-logger</a></dt>
<dd><p>Provides simple console logger for <code>message:*</code> events emitted by any emitter.</p>
</dd>
<dt><a href="#module_debugger">debugger</a></dt>
<dd><p>Logs all <code>debug</code> events emitted by any emitter to console.</p>
</dd>
<dt><a href="#module_decline-friend-requests">decline-friend-requests</a></dt>
<dd><p>Automatically declines all friend requests except for admins.</p>
<p>Use this plugin if you don&#39;t want to deal with friends list.</p>
</dd>
<dt><a href="#module_decline-group-invites">decline-group-invites</a></dt>
<dd><p>Automatically declines all group invites.</p>
<p>Use this plugin if you don&#39;t want to deal with Steam group invites.</p>
</dd>
<dt><a href="#module_decline-trade-requests">decline-trade-requests</a></dt>
<dd><p>Automatically declines all trade requests.</p>
<p>Use this plugin if you don&#39;t want to deal with regular trading system.</p>
<p><strong>Remark:</strong> This plugin does not decline trade offers.</p>
</dd>
<dt><a href="#module_essentials">essentials</a></dt>
<dd><p>Automatically emits &#39;message:info&#39; events for all major Steam events.</p>
</dd>
<dt><a href="#module_fs">fs</a></dt>
<dd><p>Provides very simple file system handler for the following events
emitted either by Vapor or plugin:</p>
<ul>
<li><code>readFile</code> -&gt; <code>fileName</code>, <code>callback(error, data)</code></li>
<li><code>writeFile</code> -&gt; <code>fileName</code>, <code>data</code>, <code>callback(error)</code></li>
</ul>
</dd>
<dt><a href="#module_offline-messages">offline-messages</a></dt>
<dd><p>Automatically removes and emits &#39;message:info&#39; events
for all pending chat messages.</p>
<p>Use this plugin if you want to get rid of pending notifications
related to offline messages.</p>
</dd>
<dt><a href="#module_presence">presence</a></dt>
<dd><p>Sets display name and online state after logging in.</p>
<p>This plugin accepts options object:</p>
<ul>
<li><code>displayName</code> (string) - display name that will be used</li>
<li><code>state</code> (number|string) - online state that will be used;
if string is provided, this plugin will use <code>utils.stringToEnum</code>
to determine the enum value</li>
</ul>
<p>This plugin replaces init options &#39;displayName&#39; and &#39;state&#39;.</p>
</dd>
<dt><a href="#module_stdin-steamguard">stdin-steamguard</a></dt>
<dd><p>Reads SteamGuard auth code from the standard input.</p>
</dd>
</dl>

<a name="module_account-flags"></a>

## account-flags
Logs account flags to console after successfully logging in.

This plugin is mostly useful for debugging and development.


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
bot.use(vapor.plugins.accountFlags);
```
<a name="module_admins"></a>

## admins
Provides whitelist-like functionality for recognizing admin accounts.

This plugin replaces built-in admins system.


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
bot.use(vapor.plugins.admins, ['7656123456789', '7656123789456']);

// somewhere in your plugin
API.emitEvent('isAdmin', '7656123456789', function(result) {
  // result === true
});
```
<a name="module_auto-reconnect"></a>

## auto-reconnect
Automatically reconnects to Steam network if:

* we get disconnected (eresult `NoConnection`)
* we receive `ServiceUnavailable` or `TryAnotherCM` after logging in

Any other case is ignored.


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
// use default reconnect timeout of 5000ms (5 seconds)
bot.use(vapor.plugins.autoReconnect);

// supply our own timeout value of 3000ms (3 seconds)
bot.use(vapor.plugins.autoReconnect, 3000);
```
<a name="module_auto-responder"></a>

## auto-responder
Automatically responds to any chat message with a predefined response.

Response is required to load this plugin.


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
bot.use(vapor.plugins.autoResponder, 'Response chat message.');
```
<a name="module_console-logger"></a>

## console-logger
Provides simple console logger for `message:*` events emitted by any emitter.


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
bot.use(vapor.plugins.consoleLogger);
```
<a name="module_debugger"></a>

## debugger
Logs all `debug` events emitted by any emitter to console.


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
bot.use(vapor.plugins.debugger);
```
<a name="module_decline-friend-requests"></a>

## decline-friend-requests
Automatically declines all friend requests except for admins.

Use this plugin if you don't want to deal with friends list.


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
bot.use(vapor.plugins.declineFriendRequests);
```
<a name="module_decline-group-invites"></a>

## decline-group-invites
Automatically declines all group invites.

Use this plugin if you don't want to deal with Steam group invites.


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
bot.use(vapor.plugins.declineGroupInvites);
```
<a name="module_decline-trade-requests"></a>

## decline-trade-requests
Automatically declines all trade requests.

Use this plugin if you don't want to deal with regular trading system.

**Remark:** This plugin does not decline trade offers.


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
bot.use(vapor.plugins.declineTradeRequests);
```
<a name="module_essentials"></a>

## essentials
Automatically emits 'message:info' events for all major Steam events.


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
bot.use(vapor.plugins.essentials);
```
<a name="module_fs"></a>

## fs
Provides very simple file system handler for the following events
emitted either by Vapor or plugin:
* `readFile` -> `fileName`, `callback(error, data)`
* `writeFile` -> `fileName`, `data`, `callback(error)`


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
// use the default folder 'data-<username>'
bot.use(vapor.plugins.fs);

// use our own data folder
bot.use(vapor.plugins.fs, 'myDataFolder');
```
<a name="module_offline-messages"></a>

## offline-messages
Automatically removes and emits 'message:info' events
for all pending chat messages.

Use this plugin if you want to get rid of pending notifications
related to offline messages.


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
bot.use(vapor.plugins.offlineMessages);
```
<a name="module_presence"></a>

## presence
Sets display name and online state after logging in.

This plugin accepts options object:
- `displayName` (string) - display name that will be used
- `state` (number|string) - online state that will be used;
if string is provided, this plugin will use `utils.stringToEnum`
to determine the enum value

This plugin replaces init options 'displayName' and 'state'.


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
bot.use(vapor.plugins.presence, {
  displayName: 'BananaBot',
  state: 'trade' // translates to 'Looking to Trade'
});

// or

bot.use(vapor.plugins.presence, {
  displayName: 'BananaBot',
  state: 1      // translates to 'Online'
});
```
<a name="module_stdin-steamguard"></a>

## stdin-steamguard
Reads SteamGuard auth code from the standard input.


| Param | Type | Description |
| --- | --- | --- |
| VaporAPI | <code>Object</code> | Instance of the API class. |

**Example**  
```js
bot.use(vapor.plugins.stdinSteamGuard);
```
