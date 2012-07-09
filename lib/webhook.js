var GitHubApi = require("github"),
	path = require('path');

// ## createHook
// Create the express middleware hook that listens for all github push events.
exports.createHook = function(callback) {
    return function(req, res, next) {
        if (!req.body || req.method !== 'POST') {
            return next();
        }
            console.log('bar');

        if (req.header('x-github-event') !== 'push') {
            return next();     
        } 

        var payload = req.body.payload;
        callback(payload, res);  
    };
};

// ## getJavascriptsFromTree
// Return all the files with a *.js extension from a github data tree.
var getJavascriptsFromTree = function(user, repo, sha, cb) {
	var github = new GitHubApi({
	    version: "3.0.0"
	});

	github.gitdata.getTree({user: user, 
		repo: repo, 
		sha: sha, 
		recursive: true}, function(err, data) {

		if (err) {
			return cb(err, null);
		}

		var tree = data.tree;
		var javascripts = tree.filter(function(blob) {
			return ".js" === path.extname(blob.path);
		});
		console.dir(javascripts);
		return cb(null, javascripts);
	});
}

exports.handlePush = function(payload, res) {
	console.dir(payload);
	
	getJavascriptsFromTree(payload.repository.owner.name, 
		payload.repository.name,  
		payload.after, function(err, js) {
			res.send({ result: 'ok' }, 200);	
		});
};