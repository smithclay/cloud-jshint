var HintParser = require('./jshint').HintParser,
    LintParser = require('./jslint').LintParser;

var parsers = exports.parsers = {
    "jshint" : HintParser,
    "jslint" : LintParser
}; 
    
exports.parserFactory = function (factory, options) {
    var parser = null,
        cls = null,
        toString = Object.prototype.toString;
    
    options = options || {};
    
    if (toString.call(factory) === '[object Function]') {
        // Instantiate via class name
        cls = factory;
    } else if (toString.call(factory) === '[object String]') {
        // Instantiate via string
        if (!parsers[factory]) {
            throw new Error("Could not create parser " + factory);
        }
        
        cls = parsers[factory];
    }
    
    return (new cls(options));
};