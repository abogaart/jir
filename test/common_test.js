'use strict';

var expect = require('chai').expect;
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
});
