// ## jshint.js
// Defines a jshint parser.
var util = require('util'),
    JSHINT = require('jshint').JSHINT,
    Parser = require('./parser').Parser;

var Hint = exports.HintParser = function (options) {
    options = options || {};
    Parser.call(this, options);
    
    this.name = 'jshint';   
};

util.inherits(Hint, Parser);

Hint.prototype.getErrors = function (fileName, fileText) {
    return !JSHINT(fileText) ? {file: fileName, errors: JSHINT.errors} : {file: fileName, errors: []};
};
