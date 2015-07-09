'use strict';

var expect = require('chai').expect;

var files = require('../lib/util/files.js');
var path  = require('path');
var sh    = require('shelljs');

describe('File utils', function() {
  it('exists', function() {
    expect(files.exists(__dirname)).to.be.true;
    expect(files.exists(__filename)).to.be.true;
    expect(files.exists(path.join(__dirname, 'non-existing'))).to.not.be.true;
    expect(files.exists(path.join(__dirname, 'non-existing.txt'))).to.not.be.true;
  });

  it('file exists', function() {
    expect(files.fileExists(__filename)).to.be.true;
    expect(files.fileExists('non-existing')).to.not.be.true;
    expect(files.fileExists('non-existing.txt')).to.not.be.true;
  });

  it('folder exists', function() {
    expect(files.folderExists(__dirname)).to.be.true;
    expect(files.folderExists('non-existing')).to.not.be.true;
    expect(files.folderExists('non-existing.txt')).to.not.be.true;
  });

  it('read non-existing file', function() {
    expect(files.readFileIfExists('non-existing')).to.not.be.true;
    expect(files.readFileIfExists('non-existing.txt')).to.not.be.true;
    expect(files.readFileIfExists('non-existing/file')).to.not.be.true;
    expect(files.readFileIfExists('non-existing/file.xml')).to.not.be.true;
  });

  it('read existing file', function() {
    expect(files.readFileIfExists('./test/resources/test.json')).to.equal('{\n  "id": "test-file"\n}');
  });

  it('read non-existing json file', function() {
    expect(files.readJSON('non-existing')).to.eql({});
    expect(files.readJSON('non-existing.json')).to.eql({});
  });

  it('read non-existing json file', function() {
    expect(files.readJSON('non-existing')).to.eql({});
    expect(files.readJSON('non-existing.json')).to.eql({});
  });

  it('read existing json file', function() {
    expect(files.readJSON('./test/resources/test.json')).to.eql({id: 'test-file'});
  });

  it('write json file', function() {
    var file = './test/resources/tmp.json';
    var json = {id: 'write-json-file'};
    files.writeJSON(json, file);
    expect(files.readJSON(file)).to.eql(json);

    // remove tmp file
    sh.rm(file);
  });

});
