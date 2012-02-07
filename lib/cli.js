var fileUtils = require('./file-utils'),
    fs = require('fs'),
    program = require('commander'),
    colors = require('colors'),
    packageJSON = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf-8')); 

var REPORT_OUTPUTS = ['console', 'google_spreadsheets'];

exports.interpret = function (argv) {
    // Parse command line options
    program
        .version(packageJSON.version)
        .option('-d, --directory [path]', 'Directory to parse', './')
        .option('-v --verbose', 'Enable verbose mode.')
        .option('-m, --mode [' + REPORT_OUTPUTS.join('|') + ']', 'Output mode', 'console');
    
    // TODO: Silent, jshint options and exclude directories
    
    // Validate mode
    program.on('mode', function () {
        if (!REPORT_OUTPUTS.some(function (output) { 
            return output === program.mode; })) {
                console.log('Output mode', program.mode, 'not supported.');
                process.exit(1);
        }
    });

    program.parse(argv);
    
    if (program.verbose) {
        console.log(('Running jspinch version ' + packageJSON.version).grey.underline);
        console.log('using default jshint options'.grey);
    }
    fileUtils.getHintErrors(program.directory, function (err, hintErrors) {
        if (err) {
            return console.error(err);
        }
        var consoleReporter = new (require('./reporters/console').Console)({verbose: program.verbose});
        consoleReporter.generate(hintErrors);
    });    
};
