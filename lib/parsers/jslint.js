// ## jslint.js
// Defines a jslint parser.
var util = require('util'),
    JSLINT = require('jslint/lib/nodelint'),
    Parser = require('./parser').Parser;

var Lint = exports.LintParser = function (options) {
    options = options || {};
    Parser.call(this, options);
    
    this.name = 'jslint';   
};

util.inherits(Lint, Parser);

Lint.prototype.getErrors = function (fileName, fileText) {
    return !JSLINT(fileText) ? {file: fileName, errors: JSLINT.errors} : {file: fileName, errors: []};  
};