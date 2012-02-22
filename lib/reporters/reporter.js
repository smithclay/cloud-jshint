// ## reporter.js
// Base Reporter object for all jspinch reporters. Inspired by winston transports.
var events = require('events'),
    util = require('util');
    
var Reporter = exports.Reporter = function (options) {
    events.EventEmitter.call(this);
    options = options || {};
    this.quiet = options.quiet || false;
    
};

// Every reporter inherits from event emitter.
util.inherits(Reporter, events.EventEmitter);

Reporter.prototype.genericReport = function (fileErrors) {
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
