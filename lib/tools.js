'use strict';
var _       = require('underscore'),
    colors  = require('colors'),
    exec    = require('child_process').exec;

var tools = exports;

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
    if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
    }
    process.exit(1);
};

tools.warn = function(msg) {
    console.log("Warning:".yellow + ' ' + msg);
};

tools.info = function(msg) {
    console.log('Info:'.green + ' ' + msg);
};

tools.isWin = function() {
    return process.platform == 'win32';
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