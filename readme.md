# jspinch
Write better javascript with jspinch. jspinch is a simple [JSHint](https://github.com/jshint/jshint/) and [JSLint](http://www.jslint.com) wrapper that lets developers track the JavaScript code quality of projects.
## Motivation
*JavaScript linters should love all your code.*

JavaScript projects start small. As they grow, it becomes important to enforce good style and convention. jspinch uses JSHint or JSLint to create reports detailing errors in JavaScript files.

It empowers developers to answer the question, "How much does JSHint (or JSLint) love my code?"

jspinch provides an extensible reporter interface. It wants to be part of a continuious integration server or your build process, for either nodejs projects or browser-only code.
## Installation
TBD, but you can eventaully use npm.

## Usage
You can run jspinch directly from the command line or extend it programmatically in your node scripts.
### CLI
To run against all *.js files, _recursively_, in the current directory:
``` sh
  $ jspinch
```
To run against all *.js files, _recursively_, in the ./lib directory, skipping the node_modules directory and using [JSLint](http://www.jslint.com) parsing:
``` sh
  $ jspinch -d lib -x node_modules -p jslint
```
For a full list of options:
``` sh
  $ jspinch -h
```
## Extending jspinch
### Writing your own reporters
Want to do something fancy with the lint error reports? You can write your own report generator for jspinch.
### Writing your own parser
Not a fan of jslint or jspinch, or want to define some sort of weird javascript lint tool specific to your application?
