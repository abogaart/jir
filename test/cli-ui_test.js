'use strict';

var expect = require('chai').expect;
var ui = require('../lib/util/cli-ui.js');
var robot = require('robotjs');
var stdout = require('test-console').stdout;

describe('CLI utils', function() {
  describe('#ask', function() {
    var restoreStdout;
    it('should ask a question', function(done) {
      restoreStdout = stdout.ignore();

      var question = {
        name: 'name',
        message: 'question 1'
      };

      ui.ask(question).then(function(data) {
        expect(data.name).to.equal('Hello World');
        restoreStdout();
        done();
      });

      robot.typeString('Hello World');
      robot.keyTap('enter');
    });
  });
});
