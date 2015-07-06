'use strict';

var shell = require('shelljs');
var files = exports;

files.readJSON = function(path) {
  return JSON.parse(files.readFileIfExists(path) || '{}');
};

files.writeJSON = function(_o, path) {
  JSON.stringify(_o, null, 4).to(path);
};

files.readFileIfExists = function(path) {
  return files.fileExists(path) ? shell.cat(path) : false;
};

files.exists = function(path) {
  return shell.test('-e', path);
};

files.fileExists = function(path) {
  return files.exists(path) && shell.test('-f', path);
};

files.folderExists = function(path) {
  return files.exists(path) && shell.test('-d', path);
};
