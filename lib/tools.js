'use strict';
var _       = require('underscore'),
    colors  = require('colors'),
    pjson   = require('./../package.json'),
    exec    = require('child_process').exec;

var tools = exports;
var debug = _.isString(process.env['JIR_DEBUG']) && process.env['JIR_DEBUG'].toLowerCase() === 'true';

tools.exec = function(cmd, success, failure, after) {
    exec(cmd).on('exit', function(code) {
        if (code > 0) {
            failure(code);
        } else {
            success();
        }
        if (after) {
            after();
        }
    });
};

tools.die = function(msg, error) {
    console.log("Error:".red + ' ' + msg);
    if (error && error.stack) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
    }
    process.exit(1);
};

tools.warn = function(msg) {
    console.log("Warning:".yellow + ' ' + msg);
};

tools.info = function() {
    var msg = tools.coloredParameters(arguments[0].split('%s'), _.rest(arguments));
    //console.log('Info:'.green + ' ' + msg);
    console.log('Jir:'.grey + ' ' + msg);
};

tools.debug = function() {
    if (!debug) {
        return;
    }
    var msg = tools.coloredParameters(arguments[0].split('%s'), _.rest(arguments));
    console.log('Debug:'.bold + ' ' + msg);
};

tools.coloredParameters = function (values, params) {
    var msg = '';
    _.each(values, function(value, i) {
        msg += value;
        if (params[i]) {
            msg += ('' + params[i]).blue;
        }
    });
    return msg;
};

tools.isWin = function() {
    return process.platform === 'win32';
};

tools.path = function() {
    var delimiter = tools.isWin() ? '\\' : '/',
        path = '';
    _.each(arguments, function(part) {
        if (part.indexOf(delimiter) !== 0) {
            path += delimiter;
        }
        path += part;
    });
    return path;
};

tools.versionAsInt = function(version) {
    version = version.replace(".", "");
    return parseInt(version, 10);
};

tools.getAppVersion = function() {
    return pjson.version;
};