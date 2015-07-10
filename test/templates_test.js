'use strict';

var expect = require('chai').expect;
var templates = require('../lib/util/templates.js');

describe('Template utils', function() {
  it('create from file', function() {
    var tpl = templates.createFromFile('test.tpl', {value: 'test value'});
    expect(tpl).to.equal('<test>test value</test>');
  });

  it('create from unknown file', function() {
    var tpl = templates.createFromFile.bind(templates, 'unkown-file.tpl', {value: 'test value'});
    expect(tpl).to.throw(Error);
  });


});
