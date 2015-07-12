'use strict';

var expect = require('chai').expect;
var files  = require('./files.js');
var path   = require('path');
var sh     = require('shelljs');

describe('File utils', function() {

  describe('#exists', function() {
    it('should return true if path references an existing file or a folder', function() {
      expect(files.exists(__dirname)).to.be.true;
      expect(files.exists(__filename)).to.be.true;
    });
    it('should return false if path references an non-existing file or a folder', function() {
      expect(files.exists(path.join(__dirname, 'non-existing'))).to.not.be.true;
      expect(files.exists(path.join(__dirname, 'non-existing.txt'))).to.not.be.true;
    });
  });

  describe('#fileExists', function() {
    it('should return true if path references an existing file', function() {
      expect(files.fileExists(__filename)).to.be.true;
    });
    it('should return false if path references a non-existing file or folder', function() {
      expect(files.fileExists('non-existing')).to.not.be.true;
      expect(files.fileExists('non-existing.txt')).to.not.be.true;
    });
    it('should return false if path references an existing folder', function() {
      expect(files.fileExists(__dirname)).to.not.be.true;
    });
  });

  describe('#folderExists', function() {
    it('should return true if path references an existing folder', function() {
      expect(files.folderExists(__dirname)).to.be.true;
    });
    it('should return false if path references a non-existing file or folder', function() {
      expect(files.folderExists('non-existing')).to.not.be.true;
      expect(files.folderExists('non-existing.txt')).to.not.be.true;
    });
    it('should return false if path references an existing file', function() {
      expect(files.folderExists(__filename)).to.not.be.true;
    });
  });

  describe('#readFileIfExists', function() {
    it('should return false when trying to read a non-existing file', function() {
      expect(files.readFileIfExists('non-existing')).to.not.be.true;
      expect(files.readFileIfExists('non-existing.txt')).to.not.be.true;
    });
    it('should return a piece of json when trying to read test file', function() {
      expect(files.readFileIfExists('./test/resources/test.json')).to.equal('{\n  "id": "test-file"\n}');
    });
  });

  describe('#readJSON', function() {
    it('should return an empty object when trying to read a non-existing file', function() {
      expect(files.readJSON('non-existing')).to.eql({});
      expect(files.readJSON('non-existing.json')).to.eql({});
    });

    it('should return a JSON object when trying to read test file', function() {
      expect(files.readJSON('./test/resources/test.json')).to.eql({id: 'test-file'});
    });
  });

  describe('#writeJSON', function() {
    it('should write a JSON object to a file', function() {
      var file = './test/resources/tmp.json';
      var json = {id: 'write-json-file'};
      files.writeJSON(json, file);
      expect(files.readJSON(file)).to.eql(json);

      // remove tmp file
      sh.rm(file);
    });
  });
});
