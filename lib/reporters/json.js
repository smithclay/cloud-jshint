var util = require('util'),
    Reporter = require('./reporter').Reporter;

var Json = exports.Json = function (options) {
    Reporter.call(this, options);
    options = options || {};
    this.name = 'console';
    this.verbose = options.verbose || false;
    this.colorize = options.colorize || true;
};

// Inherit from base Reporter object.
util.inherits(Json, Reporter);

// Main report generation function. Always called to output a console report.
Json.prototype.generate = function (hintErrors) {
    return console.log(JSON.stringify(hintErrors));
};

