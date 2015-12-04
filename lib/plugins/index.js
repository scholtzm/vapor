module.exports = {
  accountFlags: require('./account-flags.js'),
  essentials: require('./essentials.js'),
  debugger: require('./debugger.js'),
  consoleLogger: require('./console-logger.js'),
  fs: require('./fs.js'),

  declineFriendRequests: require('./decline-friend-requests.js'),
  declineGroupInvites: require('./decline-group-invites.js'),
  declineTradeRequests: require('./decline-trade-requests.js'),

  stdinSteamGuard: require('./stdin-steamguard.js'),
  autoReconnect: require('./auto-reconnect.js'),
  offlineMessages: require('./offline-messages.js'),
  autoResponder: require('./auto-responder.js')
};
