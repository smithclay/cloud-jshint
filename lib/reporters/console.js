var util = require('util'),
    colors = require('colors'),
    Table = require('cli-table'),
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

// Ugly function that outputs jshint errors with placeholders removed.
var renderHintError = function(error) { 
    return error.raw.replace('{a}', error.a || '').replace('{b}', error.b || '').
        replace('{c}', error.c || '').replace('{d}', error.d || '');
};

// Generates detailed error information for a single file given
// a fileErrors object.
Console.prototype.generateErrorsPerFile = function (fileErrors) {
    var numErrors = fileErrors.errors.length, self = this;

    if (self.verbose) {
        fileErrors.errors.forEach(function (error) {
            if (!error) {
                return;
            }
            console.log(('    Line ' + error.line).blue +
                (error.evidence ? ' ' + error.evidence : '').cyan);
            console.log('    ' + renderHintError(error).grey);
        });            
    }
    return [numErrors, fileErrors.file];
};

// Main report generation function. Always called to output a console report.
Console.prototype.generate = function (hintErrors) {
    var errorTypes = {}, self = this;
    var genericReport = self.genericReport(hintErrors);
    
    if (hintErrors.length === 0) {
        return console.log('No files found with errors.'.green);
    }    
    console.log(' ' + 'jspinch Report'.underline.grey);
    console.log();
    
    // Errors per file
    var fileReport = new Table({
        head: ['#', 'File'],
        colWidths: [5, 75]
    });
    hintErrors.forEach(function (fileErrors) {
        fileReport.push(self.generateErrorsPerFile(fileErrors));
    });
    console.log(fileReport.toString());
    console.log([' ', genericReport.filesWithErrors, 'files with errors'].join(' ').red);
    
    var errorReport = new Table({ 
        head: ['#', 'Error Type'],
        colWidths: [5, 75]
    });
    
    // Errors per type
    console.log();
    Object.keys(genericReport.errorsByType).forEach(function (errorType) {
        errorReport.push([genericReport.errorsByType[errorType], errorType]);
    });
    
    console.log(errorReport.toString());
    console.log([' ', genericReport.totalErrors,  'total errors'].join(' ').red);
    
    console.log();
};
