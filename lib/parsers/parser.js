// ## parser.js
// Base object for defining a JavaScript file parser function.
var events = require('events'),
    util = require('util');
    
var Parser = exports.Parser = function (options) {
    events.EventEmitter.call(this);
    options = options || {};
};

util.inherits(Parser, events.EventEmitter);
