'use strict';

var expect = require('chai').expect;
var chalk = require('chalk');
var sinon = require('sinon');
var log = require('../lib/util/log.js');

describe('Log utils', function() {

  describe('#objectAsString', function() {

    it('should log empty object as "{}"', function() {
      expect(log.objectAsString({})).to.equal('{}');
    });

    it('should log object properties with a colored value', function() {
      var objWithString = '{ id: ' + chalk.green('\'id\'') + ' }';
      expect(log.objectAsString({id: 'id'})).to.equal(objWithString);

      var objWithBoolean = '{ id: ' + chalk.yellow('true') + ' }';
      expect(log.objectAsString({id: true})).to.equal(objWithBoolean);

      var objWithNumber = '{ id: ' + chalk.yellow(1) + ' }';
      expect(log.objectAsString({id: 1})).to.equal(objWithNumber);
    });

    it('should log objects with nested objects', function() {
      var objWithNestedObject = '{ id: { id: ' + chalk.yellow(true) + ' } }';
      expect(log.objectAsString({id: {id: true}})).to.equal(objWithNestedObject);
    });

    it('should log objects with an empty array as property value', function() {
      var objWithEmptyArray = '{ id: [] }';
      expect(log.objectAsString({id: []})).to.equal(objWithEmptyArray);
    });

    it('should log objects with an array of numbers as property value', function() {
      var objWithArray = '{ id: [ ' + chalk.yellow(1) + ', ' + chalk.yellow(2) + ', ' + chalk.yellow(3) + ' ] }';
      expect(log.objectAsString({id: [1, 2, 3]})).to.equal(objWithArray);
    });

    it('should log objects with an array of strings as property value', function() {
      var objWithStringArray = '{ id: [ ' + chalk.green('\'1\'') + ', ' + chalk.green('\'2\'') + ', ' +
        chalk.green('\'3\'') + ' ] }';
      expect(log.objectAsString({id: ['1', '2', '3']})).to.equal(objWithStringArray);
    });

    it('should log objects with full function as property value if required', function() {
      var objWithFunction = '{ id: ' + chalk.cyan('[Function]') + ' }';
      expect(log.objectAsString({
        id: function() {
          return true;
        }
      }, true)).to.equal(objWithFunction);
    });
  });

  describe('#arrayAsString', function() {
    it('should log array as string', function() {
      expect(log.arrayAsString([])).to.equal('[]');
      var stringArray = '[ ' + chalk.green('\'1\'') + ', ' + chalk.green('\'2\'') + ' ]';
      expect(log.arrayAsString(['1', '2'])).to.equal(stringArray);
    });
  });

  var sandbox;
  function forkConsole() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(console, 'log');
    sandbox.stub(console, 'error');
  }

  function restoreConsole() {
    sandbox.restore();
  }

  describe('#log.info', function() {
    var info = chalk.grey('Jir:');

    it('should log info string to console', function() {
      forkConsole();
      log.info('Hello world');
      sinon.assert.notCalled(console.error);
      sinon.assert.calledOnce(console.log);
      sinon.assert.calledWithExactly(console.log, info + ' Hello world');
      restoreConsole();
    });

    it('should log info string with param substitution to console', function() {
      forkConsole();
      log.info('Hello %s', 'world');
      sinon.assert.notCalled(console.error);
      sinon.assert.calledOnce(console.log);
      sinon.assert.calledWithExactly(console.log, info + ' Hello %s', [chalk.blue('world')]);
      restoreConsole();
    });
  });

  describe('#log.warn', function() {
    var warn = chalk.yellow('Warning:');

    it('should log warning to console', function() {
      forkConsole();
      log.warn('Hello world');
      sinon.assert.notCalled(console.error);
      sinon.assert.calledOnce(console.log);
      sinon.assert.calledWithExactly(console.log, warn + ' Hello world');
      restoreConsole();
    });

    it('should log warning with param substitution to console', function() {
      forkConsole();
      log.warn('Hello %s', 'world');
      sinon.assert.notCalled(console.error);
      sinon.assert.calledOnce(console.log);
      sinon.assert.calledWithExactly(console.log, warn + ' Hello %s', [chalk.blue('world')]);
      restoreConsole();
    });
  });

  describe('#log.error', function() {
    var err = chalk.red('Error:');

    it('should ignore calls with no-args', function() {
      forkConsole();
      log.error();
      sinon.assert.notCalled(console.error);
      sinon.assert.notCalled(console.log);
      restoreConsole();
    });

    it('should log error from string to console', function() {
      forkConsole();
      log.error('Hello world');
      sinon.assert.notCalled(console.error);
      sinon.assert.calledOnce(console.log);
      sinon.assert.calledWithExactly(console.log, err + ' Hello world');
      restoreConsole();
    });

    it('should log error from string with non-specified parameter', function() {
      forkConsole();
      log.error('Hello world', 'moon');
      sinon.assert.notCalled(console.error);
      sinon.assert.calledOnce(console.log);
      sinon.assert.calledWithExactly(console.log, err + ' Hello world');
      restoreConsole();
    });

    it('should log error from string with parameter substitution', function() {
      forkConsole();
      log.error('Hello %s', 'world');
      sinon.assert.notCalled(console.error);
      sinon.assert.calledOnce(console.log);
      sinon.assert.calledWithExactly(console.log, err + ' Hello %s', [chalk.blue('world')]);
      restoreConsole();
    });

    it('should log "Unkown error" if Error object has no message and reason is undefined', function() {
      forkConsole();
      log.error(new Error());
      sinon.assert.notCalled(console.error);
      sinon.assert.callCount(console.log, 4);
      sinon.assert.calledWith(console.log, err + ' Unknown error');
      sinon.assert.calledWith(console.log, chalk.red('Type:') + '  Error');
      sinon.assert.calledWith(console.log, chalk.red('Stack:'));
      restoreConsole();
    });

    it('should log error from Error object with type and stack trace information', function() {
      forkConsole();
      log.error(new Error('error 1'));
      sinon.assert.notCalled(console.error);
      sinon.assert.callCount(console.log, 4);
      sinon.assert.calledWith(console.log, err + ' error 1');
      sinon.assert.calledWith(console.log, chalk.red('Type:') + '  Error');
      sinon.assert.calledWith(console.log, chalk.red('Stack:'));
      restoreConsole();
    });

    it('should log error from TypeError object', function() {
      forkConsole();
      log.error(new TypeError('error 1'));
      sinon.assert.notCalled(console.error);
      sinon.assert.callCount(console.log, 4);
      sinon.assert.calledWith(console.log, chalk.red('Type:') + '  TypeError');
      restoreConsole();
    });

    it('should log error from Error object with param substitution', function() {
      forkConsole();
      log.error(new Error('error %s'), 1);
      sinon.assert.notCalled(console.error);
      sinon.assert.callCount(console.log, 4);
      sinon.assert.calledWith(console.log, err + ' error %s', [chalk.blue('1')]);
      sinon.assert.calledWith(console.log, chalk.red('Type:') + '  Error');
      sinon.assert.calledWith(console.log, chalk.red('Stack:'));
      restoreConsole();
    });

    it('should log error from string and error object with param substitution', function() {
      forkConsole();
      log.error('Error %s', new SyntaxError('error 2'), 1);
      sinon.assert.notCalled(console.error);
      sinon.assert.callCount(console.log, 4);
      sinon.assert.calledWith(console.log, err + ' Error %s', [chalk.blue('1')]);
      sinon.assert.calledWith(console.log, chalk.red('Type:') + '  SyntaxError');
      sinon.assert.calledWith(console.log, chalk.red('Stack:'));
      sinon.assert.calledWith(console.log, sinon.match('SyntaxError: error 2'));
      restoreConsole();
    });
  });
});
