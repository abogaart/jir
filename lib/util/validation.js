'use strict';

var chalk      = require('chalk');
var files      = require('./files');
var strings    = require('./strings');
var validation = exports;

validation.checkIfFolderExists = function(path) {
  if (files.folderExists(path)) {
    return strings.translate('i18n:validation.folder-already-exists', path, chalk.bgRed);
  }
  return true;
};
