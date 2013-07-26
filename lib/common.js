'use strict';
var _       = require('underscore')._,
    shell   = require('shelljs'),
    program = require('commander'),
    log     = require('./log'),
    pjson   = require('./../package.json'),
    i18n    = require('./../locales/en/translation.json');

var common  = exports,
    debug   = _.isString(process.env.JIR_DEBUG) && process.env.JIR_DEBUG.toLowerCase() === 'true';

common.translate = function(key, colored) {
    var coloredParams = _.isBoolean(colored) ? colored : true,
        params = _.rest(arguments, _.isBoolean(colored) ? 2 : 1);

    if (_.isUndefined(i18n[key])) {
        return key + ':i18n-key-not-found';
    }

    return coloredParams ? common.formatColors(i18n[key], params) : common.format(i18n[key], params);
};

common.die = function(reason, exception) {
    var hasException = _.isObject(exception) && !_.isString(exception),
        params = hasException ? _.rest(arguments, 2) : _.rest(arguments),
        msg = common.formatColors(reason, params, 'red');

    console.log("Error:".red + ' ' + msg);

    if (hasException) {
        if (exception.stack) {
            console.log(exception.stack);
        }
        if (exception.code) {
            console.log('Error code: ' + exception.code);
        }
    }
    process.exit(1);
};

common.formatColors = function (str, params, color) {
    color = color || 'blue';
    return common.format(str, params, function(value, param, index) {
        if (param !== null) {
            value += param[color];
        }
        return value;
    });
};

common.format = function (str, params, func) {
    if (!_.isString(str)) {
        return str;
    }

    var msg = '';
    if (!_.isFunction(func)) {
        func = function(value, param, index) {
            if (param !== null) {
                value += param;
            }
            return value;
        };
    }

    _.each(str.split('%s'), function(value, index) {
        var param = params && !_.isUndefined(params[index]) ? String(params[index]) : null;
        msg += func(value, param, index);
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

common.exists = function(_path) {
    return shell.test('-e', _path);
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
        log.debug('Successfully executed %s', this.cmd);
    }
    return this.code === 0;
};