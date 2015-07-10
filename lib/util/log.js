'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var strings = require('./strings');
var debug = _.isString(process.env.JIR_DEBUG) && process.env.JIR_DEBUG.toLowerCase() === 'true';
var log = exports;

/* istanbul ignore next */
log.isDebug = function() {
  return debug;
};

/* istanbul ignore next */
log.debug = function(msg) {
  if (debug) {
    write(chalk.grey('Debug:') + ' ' + msg, _.rest(arguments));
  }
};

/* istanbul ignore next */
log.dump = function(plain, includeFunctions) {
  console.log(log.objectAsString(plain, includeFunctions));
};

log.info = function(msg) {
  write(chalk.grey('Jir:') + ' ' + msg, _.rest(arguments));
};

log.warn = function(msg) {
  write(chalk.yellow('Warning:') + ' ' + msg, _.rest(arguments));
};

// param @optional message
// param @optional error
// param @optional parameters
log.error = function(arg0, arg1) {
  if (arguments.length === 0) {
    return;
  }

  var arg0IsString = _.isString(arg0);
  // If the 1st argument is a string, check if 2nd argument is an error, otherwise check if 1st argument is an error
  var error = asError(arg0IsString ? arg1 : arg0);
  var message = arg0IsString ? arg0 : error !== null ? error.message : null;
  var params = arg0IsString && error !== null ? _.drop(arguments, 2) : _.rest(arguments);

  if (message !== null) {
    write(chalk.red('Error:') + ' ' + message, params);
  }

  if (error !== null) {
    if (error.name) {
      console.log(chalk.red('Type:') + '  ' + error.name);
    }
    if (error.stack) {
      console.log(chalk.red('Stack:'));
      var index = arg0IsString ? -1 : error.stack.indexOf('\n');
      console.log(error.stack.substring(index === -1 ? 0 : index + 1));
    }
  }
};

log.objectAsString = function(obj, includeFunctions, color) {
  return dumpObject(obj, '', includeFunctions || false, color || chalk.blue);
};

log.arrayAsString = function(ar, includeFunctions, color) {
  return dumpArray(ar, '', includeFunctions || false, color || chalk.blue);
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

function dumpObject(obj, indent, includeFunctions, color) {
  var result = '';
  for (var prop in obj) {
    var value = dumpProperty(obj[prop], indent + '  ', includeFunctions, color);
    result += indent + '  ' + prop + ': ' + value + ',\n';
  }
  result = result.replace(/,\n$/, '');
  if (result.length === 0) {
    return '{}';
  }

  return '{\n' + result + '\n' + indent + '}';
}

function dumpArray(ar, indent, includeFunctions, color) {
  if (ar.length === 0) {
    return '[]';
  }

  var result = '[\n';
  for (var i = 0, l = ar.length; i < l; i++) {
    if (i > 0) {
      result += ',\n';
    }
    result += indent + '  ';
    result += dumpProperty(ar[i], indent + '  ', includeFunctions, color);
  }
  result += '\n' + indent + ']';
  return result;
}

function dumpProperty(value, indent, includeFunctions, color) {
  if (_.isFunction(value)) {
    return includeFunctions ? value : 'function () { .. }';
  } else if (_.isString(value)) {
    return color('\'' + value + '\'');
  } else if (_.isArray(value)) {
    return dumpArray(value, indent, includeFunctions, color);
  } else if (_.isObject(value)) {
    return dumpObject(value, indent, includeFunctions, color);
  }
  return color(value);
}
