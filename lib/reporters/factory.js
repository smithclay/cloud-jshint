var Console = require('./console').Console,
    events = require('events');

var reporters = {
    "console" : Console
};

// ## reporterFactory
// Creates a reporter to output a JSHint report.
exports.reporterFactory = function (factory, options) {
    var cls = null, 
        opts = options || {}, 
        reporter = null, 
        toString = Object.prototype.toString,
        startTime = +new Date();
 
    if (toString.call(factory) === '[object Function]') {
        // Instantiate via class name
        cls = factory;
    } else if (toString.call(factory) === '[object String]') {
        // Instantiate via string
        cls = reporters[factory];
    }
    
    if (cls === null) {
        throw new Error("Could not instantiate for factory " + factory);
    }
    
    reporter = (new cls(options));
    reporter.on('finished', function (endTime) {
        console.log('  Total Time', (endTime - startTime)/1000, 'seconds');
    });
    return reporter;
}