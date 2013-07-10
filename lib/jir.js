'use strict';

var fs = require('fs')
  , colors = require('colors');

//var twitterConfig = JSON.parse(fs.readFileSync('config/configuration.json', 'utf8'));

var api = exports;

api.noArgs = function() {
    return 'noArgs';
};
