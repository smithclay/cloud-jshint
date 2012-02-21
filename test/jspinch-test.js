var vows = require('vows');
var assert = require('assert');
var events = require('events');
var Parser = require('../lib/parsers/parser').Parser;
var Reporter = require('../lib/reporters/reporter').Reporter;
 
vows.describe('jspinch').addBatch({
    'parsers': {
        topic: new Parser(),
        'extends EventEmmitter' : function (topic) {
            assert.instanceOf(topic, events.EventEmitter);
        }
    },
    'reporters': {
        topic: new Reporter(),
        'extends EventEmmitter' : function (topic) {
            assert.instanceOf(topic, events.EventEmitter);
        }
    }

}).export(module);
