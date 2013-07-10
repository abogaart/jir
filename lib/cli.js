#!/usr/bin/env node

'use strict';

var argv = require('optimist').argv
        , prompt = require('prompt')
        , colors = require('colors')
        , jir    = require('./jir');

if (argv._.length > 0) {
    console.log(argv._.join(' '));
} else {
    console.log(jir.noArgs().green);
}