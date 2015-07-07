'use strict';
var _       = require('lodash');
var chalk   = require('chalk');
var util    = require('util');
var i18n    = require('./../../locales/en/translation.json');
var strings = exports;

strings.isEmpty = function(str) {
  return _.isUndefined(str) || _.isNull(str) || str.length === 0;
};

strings.isBlank = function(str) {
  return _.isUndefined(str) || _.isNull(str) || str.trim().length === 0;
};

// Use either (str, [param1, param2]) or str, param1, param2)
strings.format = function() {
  var str = arguments[0];
  if (_.isEmpty(str)) {
    return '';
  }

  if (arguments.length <= 1) {
    return str;
  }

  var args = _.isArray(arguments[1]) ? arguments[1] : _.rest(arguments);
  if (!_.isArray(args)) {
    return str;
  }

  args.unshift(str);
  return util.format.apply(util.format, args);
};

/* @required string, @optional color, @optional params */
strings.translate = function() {
  var str = arguments[0];
  if (strings.isEmpty(str)) {
    return '';
  }

  var color = _.isFunction(arguments[1]) ? arguments[1] : chalk.red;
  var args = _.isFunction(arguments[1]) ? _.drop(arguments, 2) : _.rest(arguments);
  var numArgs = args.length;
  var index = str.indexOf('i18n:');

  if (index === 0) {
    str = str.substr(5);
    str = _.isUndefined(i18n[str]) ? str + ':i18n-key-not-found' : i18n[str];
  }

  if (numArgs > 0) {
    if (numArgs > 1 && _.isFunction(args[numArgs - 1])) {
      color = args.pop();
    }
    args = strings.colored(color, args);
    args.unshift(str);
    str = util.format.apply(util.format, args);
  }

  return str;
};

strings.colored = function(color, args) {
  if (args && args.length > 0) {
    for (var i = 0; i < args.length; i++) {
      if (!chalk.hasColor(args[i])) {
        args[i] = color(args[i]);
      }
    }
  }
  return args;
};
