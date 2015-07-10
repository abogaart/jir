'use strict';

var _ = require('lodash');
var log = require('./log');
var pjson = require('./../../package.json');
var common = exports;
var devMode = _.isString(process.env.JIR_DEVMODE) && process.env.JIR_DEVMODE.toLowerCase() === 'true';

/**
 * Quick exit out of application. No escape. If reason is provided it will have precedence over error.message in
 * log.error and error.message will be present in the stack. Both string messages can contain %s for parameter
 * substitution.
 *
 * @param reason String message to show before exit.
 * @param error Error object that caused the reason for exit.
 * @param parameters Used to substitute %s in either reason or error.message
 */
common.die = function(reason, error, parameters) {
  log.error.apply(log, arguments);
  process.exit(1);
};

/* istanbul ignore next */
common.isDevMode = function() {
  return devMode;
};

/* istanbul ignore next */
common.isWin = function() {
  return process.platform === 'win32';
};

/* istanbul ignore next */
common.getAppVersion = function() {
  return pjson.version;
};

/**
 * Parse input string into a boolean. Values 'y', 'yes', 'ok' and 'true' will return true, 'n', 'no', 'cancel' and
 * 'false' will return false. All matches are case-insensitive. If input is not recognized, null is returned.
 *
 * @param str input string that represents a boolean value
 * @returns boolean representing input string or null if not recognized.
 */
common.parseBool = function(str) {
  if (_.isString(str)) {
    str = str.toLowerCase();
    if (/^y|yes|ok|true$/i.test(str)) {
      return true;
    }
    if (/^n|no|cancel|false/i.test(str)) {
      return false;
    }
  }
  return null;
};

common.escape = function(str) {
  return str.replace(/(["\s'$`\\])/g, '\\$1');
};

/**
 * Parse a string version as an int. Uses X.Y.Z convention; 1.0.0 === 10000 and 99.99.99 the max
 * TODO: Might be replaced with semver library.
 *
 * @param version
 * @returns {number}
 */
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
