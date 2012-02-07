var util = require('util'),
    colors = require('colors'),
    Reporter = require('./reporter').Reporter;

var Console = exports.Console = function (options) {
    Reporter.call(this, options);
    options = options || {};
    this.name = 'console';
    this.verbose = options.verbose || false;
    this.colorize = options.colorize || true;
};

// Inherit from base Reporter object.
util.inherits(Console, Reporter);

var renderHintError = function(error) { 
    return error.raw.replace('{a}', error.a || '').replace('{b}', error.b || '').
        replace('{c}', error.c || '').replace('{d}', error.d || '');
};
Console.prototype.generateErrorsPerFile = function (fileErrors) {
    var numErrors = fileErrors.errors.length, self = this;
    console.log((numErrors + ' errors').yellow + ' in ' + fileErrors.file);    

    if (self.verbose) {
        fileErrors.errors.forEach(function (error) {
            if (!error) {
                return;
            }
            console.log(('    Line ' + error.line).blue 
                + (error.evidence ? ' ' + error.evidence : '').cyan);
            console.log('    ' + renderHintError(error).grey);
        });            
    }
};
Console.prototype.generate = function (hintErrors) {
    var errorTypes = {}, self = this;
    var genericReport = self.genericReport(hintErrors);
    
    if (hintErrors.length === 0) {
        return console.log('No files found with errors.'.green);
    }
    
    hintErrors.forEach(function (fileErrors) {
        self.generateErrorsPerFile(fileErrors);
    });
    
    console.log();
    console.log('jspinch Report'.underline.grey);
    console.log([genericReport.filesWithErrors, 'files found with errors.'].join(' ').red);
    console.log([genericReport.totalErrors.toString().yellow,  'total errors'].join(' '));
    console.log();
};
