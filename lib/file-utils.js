var fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    parserFactory = require('./parsers/factory').parserFactory;

// Returns an object of JSHint errors for every JS file
// inside of rootDirectory.
exports.getHintErrors = function (rootDirectory, cb) {
    var options = {cwd: path.resolve(process.cwd(), rootDirectory)};
    glob("**/*.js", options, function (err, files) {        
        if (err) {
            return cb(err, null);
        }    
        var errors = [], numFiles = files.length;
        files.forEach(function (file, ndx) {
            var filePath = path.resolve(process.cwd(), rootDirectory, file);
                      
            fs.readFile(filePath, 'utf8', function (err, src) {
                var lastFile = (ndx + 1) === numFiles;
                // For unknown reasons sometimes we get a directory...
                if (fs.lstatSync(filePath).isDirectory()) {
                    return;
                }
                
                if (err) {
                    throw err;
                }
                
                var parser = parserFactory("jshint");
                errors.push(parser.getErrors(filePath, src));
                
                if (lastFile) {
                    cb(null, errors);
                }
            });
        });    
    });    
};
