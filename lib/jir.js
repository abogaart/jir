'use strict';

var log    = require('./util/log');
var Config = require('./jir-config').Config;
var jir    = exports;

jir.init = function(verbose, update, chdir) {
  this.config = new Config(verbose, update, chdir);

  if (log.isDebug() && verbose) {
    log.debug('Successfully initialized with config:');
    log.dump(this.config);
  }
};
