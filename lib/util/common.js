'use strict';

var _       = require('lodash');
var log     = require('./log');
var pjson   = require('./../../package.json');
var common  = exports;
var devMode = _.isString(process.env.JIR_DEVMODE) && process.env.JIR_DEVMODE.toLowerCase() === 'true';

common.error = function(reason) {
  var err = new Error();
  var params = _.rest(arguments);
  err.message = common.formatColors(reason, params, 'red');
  throw err;
};

common.fail = function(msg) {
  return function(err) {
    common.die(msg, err);
  };
};

common.die = function(reason, error, args) {
  log.error.apply(log, arguments);
  process.exit(1);
};

common.isDevMode = function() {
  return devMode;
};

common.parseBool = function(str) {
  str = str.toLowerCase();
  if (/^y|yes|ok|true$/i.test(str)) {
    return true;
  }
  if (/^n|no|cancel|false/i.test(str)) {
    return false;
  }
  return null;
};

common.escape = function(str) {
  return str.replace(/(["\s'$`\\])/g, '\\$1');
};

common.isWin = function() {
  return process.platform === 'win32';
};

common.getAppVersion = function() {
  return pjson.version;
};

common.versionAsInt = function(version) {
  var v = 0;
  var range = 10000;
  _.each(version.split('.'), function(part, i) {
    if (range >= 1) {
      v += (parseInt(part, 10) || 0) * range;
      range /= 100;
    }
  });
  return v;
};
