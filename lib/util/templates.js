'use strict';

var swig      = require('swig');
var path      = require('path');
var files     = require('./files');
var log       = require('./log');
var templates = exports;
var dir       = path.join(__dirname, '../../templates');

templates.createFromTemplate = function(file, obj) {
  log.debug('Create from template');
  log.dump(obj);

  file = path.join(dir, file);
  if (!files.exists(file)) {
    throw new Error('Could not find template file ' + file);
  }

  return swig.renderFile(file, obj);
};

templates.writeToFile = function(tpl, path, overwrite) {
  if (files.exists(path) && !overwrite) {
    throw new Error('Cannot write file ' + path + ' because it already exists');
  }
  tpl.to(path);
};
