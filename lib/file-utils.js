var fs = require('fs'),
    path = require('path');
    JSHINT = require('jshint').JSHINT;

// Modified from lukebayes: http://gist.github.com/814063
var forEachFile = exports.forEachFile = function (root, cbFile, cbDone) {
    var count = 0;
    var scan = function (name) {
        ++count;
        fs.stat(name, function (err, stats) {
            if (err) cbFile(err);

            if (stats && stats.isDirectory()) {
                fs.readdir(name, function (err, files) {
                    if (err) cbFile(err);

                    files.forEach(function (file) {
                        scan(path.join(name, file));
                    });
                    done();
                });
            } else if (stats && stats.isFile()) {
                cbFile(null, name, stats, done);
            } else {
                done();
            }
        });
    }
    var done = function () {
        --count;
        if (count === 0 && cbDone) cbDone();
    }
    scan(root);
};

// Returns an array of files matching a regular expression.
var collectFiles = exports.collectFiles = function (fileExpression, root, cb) {
    var files = [];
    forEachFile(root, function (err, file, stats, cbDone) {
        if (err) {
            return cb(err, null);
        }    
        if (fileExpression.test(file)) {
            files.push(file);
        }
        cbDone();
    }, function () {
        return cb(null, files);
    });
};

// Returns an object of JSHint errors for every JS file
// inside of rootDirectory.
exports.getHintErrors = function (rootDirectory, cb) {
    collectFiles(new RegExp('\\.js$'), rootDirectory, function (err, files) {
        if (err) {
            return cb(err, null);
        }    
        var errors = [], numFiles = files.length;

        files.forEach(function (file, ndx) {
            fs.readFile(file, 'utf8', function (err, src) {
                var lastFile = (ndx + 1) === numFiles;
                if (err) {
                    throw error;
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
