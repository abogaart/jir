#!/usr/bin/env node

'use strict';

var program  = require('commander');
var Q        = require('q');
var pjson    = require('../package.json');
var files    = require('./util/files');
var log      = require('./util/log');
var jircli   = require('./jircli');

// Set program version and help handler
program
  .version(pjson.version)
  .on('--help', function() {
    var examples = files.readFileIfExists('./man/examples');
    if (examples) {
      console.log(examples);
    }
  });

// The startup phase is as follows:
// - load configuration from jircli (program options and commands)
// - configure program with these options and commands
// - parse process.argv. This will:
//   - trigger the action handler of a command
//   - return parsed program options
// - start jircli with the returned program options
//
// Since the action handler is triggered before jircli is started, the execute function is executed only when the
// start and registered promises are fulfilled.

// Setup start & register -> execute chain
var started = Q.defer();
var registered = Q.defer();
var startAndRegister = [started.promise, registered.promise];

Q.allSettled(startAndRegister).then(execute).done(success, failure);

// retrieve options and commands
var cfg = jircli.loadConfig();

// Load options into program, e.g. 'jir -v' or 'jir --verbose'
cfg.options.forEach(function(option) {
  program.option(option.flags, option.desc);
});

// Load commands into program, e.g. 'jir create workspace'. The registered promise is resolved when program.parse()
// finds a matching command in the cli input.
cfg.commands.forEach(function(cmd) {
  program
    .command(cmd.name)
    .description(cmd.desc)
    .action(function() {
      var args = arguments;
      var executeAction = function() {
        return Q
          .try(function() {
            return cmd.action.apply(cmd, args);
          })
          .then(cmd.success)
          .catch(cmd.fail)
          .finally(cmd.complete);
      };
      registered.resolve(executeAction);
    });
});

// process command line arguments and call action handler
var args = program.parse(process.argv);

// Start jircli
jircli.start(args, started);

// Registered promise should have been resolved at this point, if not, reject it
if (registered.promise.isPending()) {
  // No action specified
  registered.reject();
}

function success() {
  log.debug('Jir finished without errors.');
}

function failure(e) {
  log.error('An error occurred while running Jir. If this error keeps on returning, please add an issue ' +
    'containing a description and stacktrace of the error to the bugtracker at ' + pjson.bugs.url, e);
}

function execute(results) {
  var action = results[1];
  if (action.state === 'rejected') {
    // No action specified, show help
    program.help();
  } else {
    return action.value();
  }
}
