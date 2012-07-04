var jshint = require('jshint').JSHINT;
var fs = require('fs');

// ## errorsFromFile
// Return any errors for the uploaded file.
exports.errorsFromFile = function(file, options, cb) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            return cb(err, null);
        }

        if (!jshint(data, options)) {
            cb(null, jshint.errors);
        } else {
            cb(null, []);
        }          
    });  
};