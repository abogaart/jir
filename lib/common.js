'use strict';
var _       = require('underscore'),
    shell   = require('shelljs'),
    program = require('commander'),
    log     = require('./log'),
    pjson   = require('./../package.json'),
    i18n    = require('./../locales/en/translation.json');

var common  = exports,
    debug   = _.isString(process.env['JIR_DEBUG']) && process.env['JIR_DEBUG'].toLowerCase() === 'true';

common.translate = function() {
    var key = arguments[0],
        coloredParams = _.isBoolean(arguments[1]) ? arguments[1] : true,
        params = _.rest(arguments, _.isBoolean(arguments[1]) ? 2 : 1);

    if (_.isUndefined(i18n[key])) {
        return key + ':i18n-key-not-found';
    }

    return coloredParams ? common.formatColors(i18n[key], params) : common.format(i18n[key], params);
};

common.die = function() {
    var error = arguments[1] || false,
        params = error && error.stack ? _.rest(arguments, 1) : _.rest(arguments),
        msg = common.formatColors(arguments[0], params, 'red');

    console.log("Error:".red + ' ' + msg);

    if (error && error.stack) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
    }
    process.exit(1);
};

common.formatColors = function (str, params, color) {
    color = color || 'blue';
    return common.format(str, params, function(value, index) {
        if (!_.isUndefined(params[index])) {
            value += String(params[index])[color];
        }
        return value;
    });
};

common.format = function (str, params, func) {
    var msg = '';
    if (!_.isFunction(func)) {
        func = function(value, index) {
            if (!_.isUndefined(params[index])) {
                value += String(params[index]);
            }
            return value;
        };
    }

    _.each(str.split('%s'), function(value, index) {
        msg += func(value, index);
    });
    return msg;
};

common.isWin = function() {
    return process.platform === 'win32';
};

common.versionAsInt = function(version) {
    var v = 0,
        range = 10000;
    _.each(version.split('.'), function(part, i) {
        if (range >= 1) {
            v += (parseInt(part, 10) || 0) * range;
            range /= 100;
        }
    });
    return v;
};

common.getAppVersion = function() {
    return pjson.version;
};

common.isDebug = function() {
    return debug;
};

common.escape = function(str) {
    return str.replace(/(["\s'$`\\])/g, '\\$1');
};

common.interview = function(inputData, next) {
    var outputData = {},
        interview = function() {
            var input = inputData.shift();
            program.prompt(input.label, function(newValue) {
                outputData[input.id] = newValue;
                if (!inputData.length) {
                    next(false, outputData);
                } else {
                    interview();
                }
            });
        };
    interview();
};

var Git = exports.Git = function(git, opts) {
    this.git = git;
    this.opts = opts || {};
    this.process = null;
    this.cmd = null;
    this.output = null;
    this.error = null;
    this.code = null;
};

Git.prototype.exec = function(cmd) {
    this.cmd = this.git + ' ' + cmd;
    this.process = shell.exec(this.cmd, this.opts);
    this.output = this.process.output;
    this.error = this.process.error;
    this.code = this.process.code;
    if (this.code > 0) {
        log.debug('Execute %s failed with output %s', this.cmd, this.output);
    } else {
        log.debug('Executed %s', this.cmd);
    }
    return this.code === 0;
};