'use strict';

var expect = require('chai').expect;
var templates = require('../lib/util/templates.js');

describe('Template utils', function() {
  describe('#createFromFile', function() {
    it('should create a template from file', function() {
      var tpl = templates.createFromFile('test.tpl', {value: 'test value'});
      expect(tpl).to.equal('<test>test value</test>');
    });
    it('should throw an error when trying to create a template from an unknown file', function() {
      var tpl = templates.createFromFile.bind(templates, 'unkown-file.tpl', {value: 'test value'});
      expect(tpl).to.throw(Error);
    });
  });
});
