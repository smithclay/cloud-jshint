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
    var row = [];
    fileErrors.errors.forEach(function (error) {
        if (!error) {
            return;
        }
        row.push(['', '  ' +  error.raw ? '[Line ' +  error.line + '] ' 
            + renderHintError(error) : '']);
        row.push(['', error.evidence ? '  ' + error.evidence.replace(/^\s*|\s*$/g, '') : '' ])
    });            
    
    return row;
};

// Main report generation function. Always called to output a console report.
Console.prototype.generate = function (hintErrors) {
    var errorTypes = {}, self = this;
    var genericReport = self.genericReport(hintErrors);
    var columns = process.env['COLUMNS'] || 80;
    if (hintErrors.length === 0) {
        return console.log('No files found with errors.'.green);
    }    
    console.log(' ' + 'jspinch Report'.underline.grey);
    console.log();
    
    // Errors per file
    var fileReport = new Table({
        head: ['#', 'File'],
        colWidths: [5, columns - 10]
    });
    hintErrors.forEach(function (fileErrors) {
        fileReport.push([fileErrors.errors.length, fileErrors.file]);
        if (self.verbose) {
            self.generateErrorsPerFile(fileErrors).forEach(function (fileError) {
                fileReport.push(fileError);
            });    
        }
    });
    console.log(fileReport.toString());
    console.log([' ', genericReport.filesWithErrors, 'files with errors'].join(' ').red);
    
    var errorReport = new Table({ 
        head: ['#', 'Error Type'],
        colWidths: [5, columns - 15]
    });
    
    // Errors per type
    console.log();
    Object.keys(genericReport.errorsByType).forEach(function (errorType) {
        errorReport.push([genericReport.errorsByType[errorType], errorType]);
    });
    
    console.log(errorReport.toString());
    console.log([' ', genericReport.totalErrors,  'total errors'].join(' ').red);
    self.emit('finished', +new Date());
};
