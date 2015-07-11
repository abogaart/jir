'use strict';

var expect = require('chai').expect;
var sh     = require('shelljs');
var files  = require('../lib/util/files.js');
var tpls   = require('../lib/util/templates.js');

describe('Template utils', function() {
  describe('#createFromFile', function() {
    it('should create a template from file', function() {
      var tpl = tpls.createFromFile('test.tpl', {value: 'test value'});
      expect(tpl).to.equal('<test>test value</test>');
    });
    it('should throw an error when trying to create a template from an unknown file', function() {
      var tpl = tpls.createFromFile.bind(tpls, 'unkown-file.tpl', {value: 'test value'});
      expect(tpl).to.throw(Error);
    });
  });

  describe('#writeToFile', function() {
    it('should write a template to a file', function() {
      var tpl = tpls.createFromFile('test.tpl', {value: 'test value'});
      var path = 'test-tmp.txt';
      tpls.writeToFile(tpl, path, true);
      var newFile = files.readFileIfExists(path);
      expect(newFile).to.equal('<test>test value</test>');
      sh.rm(path);
    });

    it('should throw an error when trying to overwrite existing file', function() {
      var tpl = tpls.createFromFile('test.tpl', {value: 'test value'});
      var path = 'test-tmp.txt';
      tpls.writeToFile(tpl, path, true);

      var write = tpls.writeToFile.bind(tpls, tpl, path);
      expect(write).to.throw(Error);

      sh.rm(path);
    });

  });
});
