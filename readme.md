# jspinch
[![Build Status](https://secure.travis-ci.org/smithclay/jspinch.png)](http://travis-ci.org/smithclay/jspinch])

Write better javascript with jspinch. jspinch is a RESTful web service wrapper around [JSHint](https://github.com/jshint/jshint/) that lets developers track the JavaScript code quality of projects.
## Motivation

JavaScript projects start small. As they grow, it becomes important to enforce good style and convention. jspinch uses JSHint to create reports detailing errors in JavaScript files.

## Installation
TBD
## Usage
You can run jspinch directly from the command line or extend it programmatically in your node scripts.
### curl
To get jshint errors for a single file

``` sh
  $ curl -Ffile=@path/to/file.js http://jspinch-server/wherever/that/is
```

