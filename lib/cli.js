#!/usr/bin/env node

'use strict';

var program  = require('commander');
var Q        = require('q');
var pjson    = require('../package.json');
var files    = require('./util/files');
var log      = require('./util/log');
var jircli   = require('./jir-cli');

// Both these promises should be resolved before an action can be executed
var init = Q.defer();
var registerAction = Q.defer();

// Setup parse - init - execute chain
Q.allSettled([init.promise, registerAction.promise])
.then(function(results) {
  var action = results[1];
  if (action.state === 'rejected') {
    // No action specified, show help
    program.help();
  } else {
    return action.value();
  }
})
.done(function() {
  log.debug('Jir finished without errors.');
}, function(e) {
  log.error('An error occurred while running Jir. If this error keeps on returning, please add an issue ' +
    'containing a description and stacktrace of the error to the bugtracker at ' + pjson.bugs.url, e);
});

// Set program version and help handler
program
  .version(pjson.version)
  .on('--help', function() {
    files.readFileIfExists('./man/examples');
    var examples = files.readFileIfExists('./man/examples');
    if (examples) {
      console.log(examples);
    }
  });

// Load options into program, e.g. 'jir -v' or 'jir --verbose'
jircli.loadOptions(program);

// Load commands into program, e.g. 'jir create workspace'. The registerAction promise is resolved if program.parse()
// finds a matching command in the cli input.
jircli.loadCommands(program, registerAction);

// Initialize jircli
jircli.init(program);

// Resolve initialization promise
init.resolve();

// Action promise should have been resolved at this point, if not, reject it
if (registerAction.promise.isPending()) {
  // No action specified
  registerAction.reject();
}
