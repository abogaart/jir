'use strict';

var _      = require('underscore')._,
    common = require('./common.js');

require('colors');

var log = exports;

log.warn = function(msg) {
    console.log('Warning:'.yellow + ' ' + common.formatColors(msg, _.rest(arguments)));
};

log.info = function(msg) {
    console.log('Jir:'.grey + ' ' + common.formatColors(msg, _.rest(arguments)));
};

log.debug = function(msg) {
    if (common.isDebug()) {
        console.log('Debug:'.grey + ' ' + common.formatColors(msg, _.rest(arguments)));
    }
};
