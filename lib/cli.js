var fileUtils = require('./file-utils'),
    fs = require('fs'),
    program = require('commander'),
    colors = require('colors'),
    rptFactory = require('./reporters/factory').reporterFactory,
    parserFactory = require('./parsers/factory').parserFactory,
    reporters = require('./reporters/factory').reporters,
    parsers = require('./parsers/factory').parsers,
    packageJSON = require('./../package.json'); 

exports.interpret = function (argv) {
    // Parse command line options
    program
        .version(packageJSON.version)
        .option('-d, --directory [path]', 'directory to parse', './')
        .option('-v --verbose', 'enable verbose mode.')
        .option('-m, --mode [' + Object.keys(reporters).join('|') + ']', 'output mode', 'console')
        .option('-p, --parser [' + Object.keys(parsers).join('|') + ']', 'lint parser to use', 'jshint');
    
    // TODO: Quiet mode and exclude file patterns
    
    // Validate mode
    program.on('mode', function () {
        if (!REPORT_OUTPUTS.some(function (output) { 
            return output === program.mode; })) {
                console.log('Output mode', program.mode, 'not supported.');
                process.exit(1);
        }
    });

    program.parse(argv);

    var reporter = rptFactory(program.mode, {verbose: program.verbose});
    var parser = parserFactory(program.parser);
    
    fileUtils.getHintErrors(program.directory, parser, function (err, hintErrors) {
        if (err) {
            return console.error(err);
        }         
        reporter.generate(hintErrors);
    });    
};
