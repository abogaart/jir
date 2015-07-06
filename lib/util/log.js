'use strict';

var _      = require('lodash');
var chalk    = require('chalk');
var strings  = require('./strings');
var debug   = _.isString(process.env.JIR_DEBUG) && process.env.JIR_DEBUG.toLowerCase() === 'true';
var log     = exports;

log.debug = function(msg) {
  if (debug) {
    write(chalk.grey('Debug:') + ' ' + msg, _.rest(arguments));
  }
};

log.dump = function(plain, includeFunctions) {
  console.log(log.objectAsString(plain, includeFunctions));
};

log.objectAsString = function(plain, includeFunctions) {
  var color = chalk.blue;
  includeFunctions = includeFunctions || false;
  function _dump(obj, indent) {
    var result = '';
    for (var property in obj) {
      var value = obj[property];
      if (!includeFunctions && _.isFunction(value)) {
        continue;
      }

      if (typeof value == 'string') {
        value = color('\'' + value + '\'');
      } else if (typeof value == 'object') {
        if (value instanceof Array) {
          value = color('[ ' + value + ' ]');
        } else {
          var od = _dump(value, indent + '  ');
          value = '\n' + indent + '{\n' + od + '\n' + indent + '}';
        }
      } else if (!_.isFunction(value)) {
        value = color(value);
      }
      result += indent + property + ' : ' + value + ',\n';
    }
    return result.replace(/,\n$/, '');
  }
  return _dump(plain, '  ');
};

log.info = function(msg) {
  write(chalk.grey('Jir:') + ' ' + msg, _.rest(arguments));
};

log.error = function(/*@optional cause, error, parameters*/) {
  var error = null;
  var message = null;
  var params = null;

  if (arguments.length === 0) {
    return;
  }

  if (_.isString(arguments[0])) {
    message = arguments[0];
    if (arguments.length > 1) {
      error = asError(arguments[1]);
      if (error === null) {
        //assume rest arguments are params
        params = _.rest(arguments);
      } else {
        params = _.drop(arguments, 2);
      }
    }
  } else {
    error = asError(arguments[0]);
    message = error !== null ? error.message : null;
  }

  if (message === null) {
    return;
  }

  write(chalk.red('Error:') + ' ' + message, params);

  if (error !== null) {
    if (error.code) {
      console.log('Error code: ' + error.code);
    }
    if (error.stack) {
      console.log(error.stack);
    }
  }
};

log.warn = function(msg) {
  write(chalk.yellow('Warning:') + ' ' + msg, _.rest(arguments));
};

log.isDebug = function() {
  return debug;
};

function write(msg, args) {
  if (args !== null && args.length > 0 && msg.indexOf('%s') > -1) {
    console.log(msg, strings.colored(chalk.blue, args));
  } else {
    console.log(msg);
  }
}

function asError(o) {
  if (_.isObject(o) && !_.isString(o) && o.hasOwnProperty('message')) {
    return o;
  }
  return null;
}
