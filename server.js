var express = require('express'),
    util = require('util'),
    fs = require('fs'),
    format = util.format,
    path = require('path'),
    jshint = require('jshint').JSHINT;
    
var app = express.createServer();
app.use(express.bodyParser());

app.get('/', function(req, res){
    res.send('welcome to jspinch.');
});

app.post('/file', function(req, res) {
    var options = req.body.options || {};
    
    // Request must have a posted file.
    if (!req.files || !req.files.file) {
        return res.send('No file specified in request\n', 400);
    }
    
    // The file must be a javascript file.
    var file = req.files.file;    
    if (".js" !== path.extname(file.name)) {
        return res.send('File extension must be .js\n', 400);
    }
    
    // Parse optional options object.
    if (typeof options === "string") {
        try {
            options = JSON.parse(options);
        } catch (e) {
            options = {}; 
        }
    }
    
    // Return any errors for the uploaded file.
    fs.readFile(file.path, 'utf8', function(err, data) {
        if (!jshint(data, options)) {
            res.send(jshint.errors);
        } else {
            res.send(204);
        }          
    });   
});

// Start listening.
var port = process.env.PORT || 3000;
console.log(format('starting jspinch server on port %s.', port));
app.listen(port);