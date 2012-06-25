var express = require('express'),
    util = require('util'),
    fs = require('fs'),
    format = util.format,
    jshint = require('jshint').JSHINT;
    
var app = express.createServer();
app.use(express.bodyParser());

app.get('/', function(req, res){
    res.send('welcome to jspinch.');
});

app.post('/file', function(req, res) {
    var options = req.body.options || {};    
    // Parse options object.
    if (typeof options === "string") {
        try {
            options = JSON.parse(options);
        } catch (e) {
            options = {}; 
        }
    }
    
    if (!req.files || !req.files.file) {
        res.send(400);
    }
    
    // Parse uploaded file for errors.
    fs.readFile(req.files.file.path, 'utf8', function(err, data) {
        if (!jshint(data, options)) {
            res.send(jshint.errors);
        } else {
            res.send(200);
        }          
    });   
});

// Start listening.
var port = process.env.PORT || 3000;
console.log(format('starting jspinch server on port %s.', port));
app.listen(port);
