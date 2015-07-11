'use strict';

var expect = require('chai').expect;
var sinon  = require('sinon');
var common = require('../lib/util/common.js');

describe('Common utils', function() {

  describe('#versionAsInt', function() {
    it('should convert "X" into X * 10000', function() {
      expect(common.versionAsInt('1')).to.equal(10000);
      expect(common.versionAsInt('5')).to.equal(50000);
      expect(common.versionAsInt('10')).to.equal(100000);
    });
    it('should convert "X.Y" into X * 10000 + Y * 100', function() {
      expect(common.versionAsInt('1.0')).to.equal(10000);
      expect(common.versionAsInt('1.1')).to.equal(10100);
      expect(common.versionAsInt('1.25')).to.equal(12500);
    });
    it('should convert "X.Y.Z" into X * 10000 + Y * 100 + Z * 1', function() {
      expect(common.versionAsInt('1.00.00')).to.equal(10000);
      expect(common.versionAsInt('1.25.10')).to.equal(12510);
    });
  });

  describe('#escape', function() {
    it('should escape commandline parameters', function() {
      expect(common.escape('escape-me')).to.equal('escape-me');
      expect(common.escape('escape me')).to.equal('escape\\ me');
      expect(common.escape('escape" me')).to.equal('escape\\"\\ me');
    });
  });

  describe('#parseBool', function() {
    it('should parse a string into a boolean', function() {
      expect(common.parseBool()).to.be.null;
      expect(common.parseBool('test')).to.be.null;

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

  describe('#die', function() {
    var sandbox;
    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      sandbox.stub(process, 'exit');
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('should log an error and exit the application', function() {
      common.die();
      sinon.assert.calledOnce(process.exit);
      sinon.assert.calledWithExactly(process.exit, 1);
    });
  });

});
