var express = require('express'),
    util = require('util'),
    fs = require('fs'),
    format = util.format,
    path = require('path'),
    helpers = require('./lib/helpers'),
    winston = require('winston');
    webhook = require('./lib/webhook');
    
var app = express.createServer();

app.get('/', function(req, res){
    res.send('welcome to jspinch');
});

app.post('/file', function(req, res) {
    var options = (req.body && req.body.options) || {};

    // Request must have a posted file.
    if (!req.files) {
        return res.send('No file specified in request\n', 400);
    }
    // The file must be a javascript file.
    var file = req.files.file;    
    if ('.js' !== path.extname(file.name)) {
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

    helpers.errorsFromFile(file.path, options, function(err, hintErrors) {
        if (err) {
            res.send('Error: ' + err, 500);
        }
        if (hintErrors.length > 0) {
            res.send(hintErrors);
        } else {
            res.send(204);
        }
    }); 
});

app.configure(function() {
    app.use(express.bodyParser());
    app.use(webhook.createHook(webhook.handlePush));
});

// Start listening.
var port = process.env.PORT || 3000;
winston.info(format('starting jspinch server on port %s.', port));
app.listen(port);
