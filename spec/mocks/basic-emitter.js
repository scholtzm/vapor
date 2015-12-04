var util = require('util');
var EventEmitter = require('events').EventEmitter;

function BasicEmitter() {
  EventEmitter.call(this);
}

util.inherits(BasicEmitter, EventEmitter);

module.exports = BasicEmitter;
