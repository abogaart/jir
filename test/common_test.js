'use strict';

var expect = require('chai').expect;
var chalk  = require('chalk');
var common = require('../lib/util/common.js');

describe('Common utils', function() {
  it('parse version string as int', function() {
    expect(common.versionAsInt('1')).to.equal(10000);
    expect(common.versionAsInt('1.0')).to.equal(10000);
    expect(common.versionAsInt('1.1')).to.equal(10100);
    expect(common.versionAsInt('1.25')).to.equal(12500);
    expect(common.versionAsInt('1.00.00')).to.equal(10000);
    expect(common.versionAsInt('1.25.10')).to.equal(12510);
  });

  it('escape commandline parameter', function() {
    expect(common.escape('escape-me')).to.equal('escape-me');
    expect(common.escape('escape me')).to.equal('escape\\ me');
    expect(common.escape('escape" me')).to.equal('escape\\"\\ me');
  });

  it('create error with colored params', function() {
    expect(common.error.bind(common, 'It is bad!')).to.throw('It is bad!');
    expect(common.error.bind(common, 'It is %s!', 'bad')).to.throw('It is ' + chalk.red('bad') + '!');
  });

  it('parse bool', function() {
    expect(common.parseBool()).to.equal(null);
    expect(common.parseBool('test')).to.equal(null);

    var yes = ['y', 'yes', 'ok', 'true'];
    yes.forEach(function(b) {
      expect(common.parseBool(b)).to.be.true;
      expect(common.parseBool(b.toUpperCase())).to.be.true;
    });

    var no = ['n', 'no', 'cancel', 'false'];
    no.forEach(function(b) {
      expect(common.parseBool(b)).to.not.be.true;
      expect(common.parseBool(b.toUpperCase())).to.not.be.true;
    });
  });

});
