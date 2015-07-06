'use strict';

var _ = require('lodash');
var path = require('path');
var sh = require('shelljs');
var common = require('./util/common');
var files = require('./util/files');
var strings = require('./util/strings');
var log = require('./util/log');

// Initialize settings with priority: command line overrides -> project settings -> global settings -> default settings
exports.Config = function(verbose, update, pwd) {

  var cfg = require(common.isDevMode() ? './../config/jir-config-dev.json' : './../config/jir-config.json');

  // Get version from package.json
  cfg.version = common.getAppVersion();

  // Setup paths to home dir
  cfg.homeDir = common.isWin() ? path.join(process.env.APPDATA, 'Hippo', 'jir') :
    path.join(process.env.HOME, '.jir');

  // Setup paths to config files
  cfg.configFile = path.join(cfg.homeDir, 'jir-config.json');
  cfg.updateFile = path.join(cfg.homeDir, 'jir-update.json');

  // If application home dir is not present, create one and welcome the user
  if (!files.exists(cfg.homeDir)) {
    log.debug('Create folder %s', cfg.homeDir);
    sh.mkdir(cfg.homeDir);

    //write settings to disk
    files.writeJSON(cfg, cfg.configFile);

    this.homeDirCreated = true;
  } else {
    _.extend(cfg, files.readJSON(cfg.configFile));
  }

  // TODO: implements logic for project settings

  checkEnvironment(cfg);

  if (verbose) {
    cfg.verbose = true;
  }

  if (update) {
    cfg.forceUpdate = true;
  }

  cfg.pwd = pwd ? pwd : sh.pwd();

  if (!files.exists(cfg.updateFile)) {
    //create new update file
    files.writeJSON({lastUpdate: null, lastChanged: null}, cfg.updateFile);
  }

  // Copy values in cfg to this instance
  _.extend(this, cfg);
};

function checkEnvironment(cfg) {
  // Ensure Git is installed
  if (!sh.which(cfg.git.exec)) {
    common.die(strings.translate('die.no.git'), cfg.git.exec);
  }

  // Ensure Maven3 is installed
  if (!sh.which(cfg.mvn.exec)) {
    common.die(strings.translate('die.no.mvn'), cfg.mvn.exec);
  }

  // Ensure SVN is installed
  if (!sh.which(cfg.svn.exec)) {
    common.die(strings.translate('die.no.svn'), cfg.svn.exec);
  }
}
