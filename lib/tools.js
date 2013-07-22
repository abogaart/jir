'use strict';
var _       = require('underscore'),
    colors  = require('colors'),
    pjson   = require('./../package.json'),
    i18next = require('i18next'),
    exec    = require('child_process').exec;

var tools = exports;
var debug = _.isString(process.env['JIR_DEBUG']) && process.env['JIR_DEBUG'].toLowerCase() === 'true';

i18next.init({
    //resSetPath: 'locales/__lng__/new.__ns__.json',
    useCookie: false,
    lng: 'en-US',
    load: 'unspecific',
    saveMissing: true,
    sendMissingTo: 'fallback',
    debug: debug
});

tools.translate = function(key) {
    return i18next.t(key);
};

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

tools.die = function() {
    var error = arguments[1] || false,
        params = error && error.stack ? _.rest(arguments, 1) : _.rest(arguments),
        msg = tools.coloredParameters(arguments[0].split('%s'), params);

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
    if (debug) {
        var msg = tools.coloredParameters(arguments[0].split('%s'), _.rest(arguments));
        console.log('Debug:'.bold + ' ' + msg);
    }
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

tools.versionAsInt = function(version) {
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

tools.getAppVersion = function() {
    return pjson.version;
};