'use strict';

var _      = require('underscore'),
    common = require('./common.js');

require('colors');

var log = exports;

log.warn = function() {
    console.log('Warning:'.yellow + ' ' + common.formatColors(arguments[0], _.rest(arguments)));
};

log.info = function() {
    console.log('Jir:'.grey + ' ' + common.formatColors(arguments[0], _.rest(arguments)));
};

log.debug = function() {
    if (common.isDebug()) {
        console.log('Debug:'.grey + ' ' + common.formatColors(arguments[0], _.rest(arguments)));
    }
};
