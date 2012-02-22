// ## reporter.js
// Base Reporter object for all jspinch reporters. Inspired by winston transports.
var events = require('events'),
    util = require('util');
    
var Reporter = exports.Reporter = function (options) {
    events.EventEmitter.call(this);
    options = options || {};
    this.quiet = options.quiet || false;
    this.errors = [];
};

// Every reporter inherits from event emitter.
util.inherits(Reporter, events.EventEmitter);

// ## hasErrors
// Determines if the reporter has errors
Reporter.prototype.hasErrors = function () {
    return this.errors && this.errors.length > 0;
};

// ## setErrors
// Sets the error object on the reporter to be used for output.
Reporter.prototype.setErrors = function (errors) {
    this.errors = errors || [];
    return this;
};

Reporter.prototype.genericReport = function () {    
    var fileErrors = this.errors || [];
    
    return fileErrors.length === 0 ? {} : { 
        "filesWithErrors" : fileErrors.length,
        "errorsByType": fileErrors.map(function (fileError) {
                return fileError.errors.map(function (error) {
                    return error ? error.raw : 'unknown';
                });
            }).reduce(function (a, b) {
                return a.concat(b);
            }).reduce(function (memo, errorType) {
                memo[errorType] = (memo[errorType] || 0) + 1;
                return memo;
            }, {}),
        "totalErrors" : fileErrors.reduce(function (numErrors, fileError) { 
            return fileError.errors.length + numErrors; 
        }, 0)
    };
};
