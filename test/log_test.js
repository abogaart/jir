'use strict';

var expect = require('chai').expect;
var chalk  = require('chalk');
var sinon  = require('sinon');
var log = require('../lib/util/log.js');

describe('Log utils', function() {
  var sandbox;

  beforeEach(function() {
    // create a sandbox
    sandbox = sinon.sandbox.create();

    // stub some console methods
    sandbox.stub(console, 'log');
    sandbox.stub(console, 'error');
  });

  afterEach(function() {
    // restore the environment as it was before
    sandbox.restore();
  });

  it('log object as string', function() {
    var c = chalk.blue;

    expect(log.objectAsString({})).to.equal('{}');

    var objWithString = '{\n  id: ' + c('\'id\'') + '\n}';
    expect(log.objectAsString({id: 'id'})).to.equal(objWithString);

    var objWithBoolean = '{\n  id: ' + c('true') + '\n}';
    expect(log.objectAsString({id: true})).to.equal(objWithBoolean);

    var objWithNestedObject = '{\n  id: {\n    id: ' + c(true) + '\n  }\n}';
    expect(log.objectAsString({id: {id: true}})).to.equal(objWithNestedObject);

    var objWithEmptyArray = '{\n  id: []\n}';
    expect(log.objectAsString({id: []})).to.equal(objWithEmptyArray);

    var objWithArray = '{\n  id: [\n    ' + chalk.blue(1) + ',\n    ' + chalk.blue(2) + ',\n    ' +
      chalk.blue(3) + '\n  ]\n}';
    expect(log.objectAsString({id: [1, 2, 3]})).to.equal(objWithArray);

    var objWithStringArray = '{\n  id: [\n    ' + chalk.blue('\'1\'') + ',\n    ' + chalk.blue('\'2\'') + ',\n    ' +
      chalk.blue('\'3\'') + '\n  ]\n}';
    expect(log.objectAsString({id: ['1', '2', '3']})).to.equal(objWithStringArray);

    var objWithFunction = '{\n  id: function () { return true; }\n}';
    expect(log.objectAsString({id: function() { return true; }}, true)).to.equal(objWithFunction);

    var objWithFunctionPlaceholder = '{\n  id: function () { .. }\n}';
    expect(log.objectAsString({id: function() { return true; }})).to.equal(objWithFunctionPlaceholder);

  });

  it('log array as string', function() {
    var c = chalk.blue;

    expect(log.arrayAsString([])).to.equal('[]');

    var stringArray = '[\n  ' + c('\'1\'') + ',\n  ' + c('\'2\'') + '\n]';
    expect(log.arrayAsString(['1', '2'])).to.equal(stringArray);
  });

  // Hacky testing
  var info = chalk.grey('Jir:');
  it('log info string', function() {
    log.info('Hello world');
    sinon.assert.notCalled(console.error);
    sinon.assert.calledOnce(console.log);
    sinon.assert.calledWithExactly(console.log, info + ' Hello world');
  });

  it('log info string with param', function() {
    log.info('Hello %s', 'world');
    sinon.assert.notCalled(console.error);
    sinon.assert.calledOnce(console.log);
    sinon.assert.calledWithExactly(console.log, info + ' Hello %s', [chalk.blue('world')]);
  });

  var warn = chalk.yellow('Warning:');
  it('log warning string', function() {
    log.warn('Hello world');
    sinon.assert.notCalled(console.error);
    sinon.assert.calledOnce(console.log);
    sinon.assert.calledWithExactly(console.log, warn + ' Hello world');
  });

  it('log warning string with param', function() {
    log.warn('Hello %s', 'world');
    sinon.assert.notCalled(console.error);
    sinon.assert.calledOnce(console.log);
    sinon.assert.calledWithExactly(console.log, warn + ' Hello %s', [chalk.blue('world')]);
  });

  it('log error no-args', function() {
    log.error();
    sinon.assert.notCalled(console.error);
    sinon.assert.notCalled(console.log);
  });

  var err = chalk.red('Error:');
  it('log error from string', function() {
    log.error('Hello world');
    sinon.assert.notCalled(console.error);
    sinon.assert.calledOnce(console.log);
    sinon.assert.calledWithExactly(console.log, err + ' Hello world');
  });

  it('log error from string with non-existing param', function() {
    log.error('Hello world', 'moon');
    sinon.assert.notCalled(console.error);
    sinon.assert.calledOnce(console.log);
    sinon.assert.calledWithExactly(console.log, err + ' Hello world');
  });

  it('log error from string with param', function() {
    log.error('Hello %s', 'world');
    sinon.assert.notCalled(console.error);
    sinon.assert.calledOnce(console.log);
    sinon.assert.calledWithExactly(console.log, err + ' Hello %s', [chalk.blue('world')]);
  });

  it('log error from error object', function() {
    log.error(new Error('error 1'));
    sinon.assert.notCalled(console.error);
    sinon.assert.callCount(console.log, 4);
    sinon.assert.calledWith(console.log, err + ' error 1');
    sinon.assert.calledWith(console.log, chalk.red('Type:') + '  Error');
    sinon.assert.calledWith(console.log, chalk.red('Stack:'));
  });

  it('log error from TypeError object', function() {
    log.error(new TypeError('error 1'));
    sinon.assert.notCalled(console.error);
    sinon.assert.callCount(console.log, 4);
    sinon.assert.calledWith(console.log, err + ' error 1');
    sinon.assert.calledWith(console.log, chalk.red('Type:') + '  TypeError');
    sinon.assert.calledWith(console.log, chalk.red('Stack:'));
  });

  it('log error from Error object with params', function() {
    log.error(new Error('error %s'), 1);
    sinon.assert.notCalled(console.error);
    sinon.assert.callCount(console.log, 4);
    sinon.assert.calledWith(console.log, err + ' error %s', [chalk.blue('1')]);
    sinon.assert.calledWith(console.log, chalk.red('Type:') + '  Error');
    sinon.assert.calledWith(console.log, chalk.red('Stack:'));
  });

  it('log error from string and error object', function() {
    log.error('Error %s', new SyntaxError('error 2'), 1);

    sinon.assert.notCalled(console.error);
    sinon.assert.callCount(console.log, 4);
    sinon.assert.calledWith(console.log, err + ' Error %s', [chalk.blue('1')]);
    sinon.assert.calledWith(console.log, chalk.red('Type:') + '  SyntaxError');
    sinon.assert.calledWith(console.log, chalk.red('Stack:'));
    sinon.assert.calledWith(console.log, sinon.match('SyntaxError: error 2'));
  });
});
