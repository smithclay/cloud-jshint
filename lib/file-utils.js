var fs = require('fs'),
    path = require('path'),
    glob = require('glob');
    JSHINT = require('jshint').JSHINT;

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
                
                if (fs.lstatSync(filePath).isDirectory()) {
                    return;
                }
                
                if (err) {
                    throw err;
                }
                if (!JSHINT(src)) {
                    errors.push({file: file, errors: JSHINT.errors});
                }
                if (lastFile) {
                    cb(null, errors);
                }
            });
        });    
    });    
};
