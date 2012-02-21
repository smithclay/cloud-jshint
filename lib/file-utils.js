var fs = require('fs'),
    path = require('path'),
    minimatch = require("minimatch")
    glob = require('glob');

// Returns an object of JSHint errors for every JS file
// inside of rootDirectory.
exports.getHintErrors = function (options, cb) {
    var options = options || {};
    
    if (!options.parser) {
        return cb(new Error("Must specifiy a parser"), null);
    }
    
    if (!options.rootDirectory) {
        return sb(new Error("Must specify a root directory"), null);
    }
    
    var globSettings = {cwd: path.resolve(process.cwd(), options.rootDirectory)};
    glob("**/*.js", globSettings, function (err, files) {        
        if (err) {
            return cb(err, null);
        }    
        var errors = [], numFiles = files.length;
                
        files.forEach(function (file, ndx) {
            var filePath = path.resolve(process.cwd(), options.rootDirectory, file);
            
            if (options.exclude) {
                var skip = false;
                options.exclude.forEach(function (exclude) {
                    if (skip) {
                        return;
                    }                  
                    skip = minimatch(file, exclude) || minimatch(file, exclude + "/**");
                });
            }
            
            if (skip) {
                return;
            }        
            
            fs.readFile(filePath, 'utf8', function (err, src) {
                var lastFile = (ndx + 1) === numFiles;
                // For unknown reasons sometimes we get a directory...
                if (fs.lstatSync(filePath).isDirectory()) {
                    return;
                }
                
                if (err) {
                    throw err;
                }
                
                errors.push(options.parser.getErrors(filePath, src));
                
                if (lastFile) {
                    cb(null, errors);
                }
            });
        });    
    });    
};
