var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Steam() {
  EventEmitter.call(this);
}

util.inherits(Steam, EventEmitter);

module.exports = Steam;
