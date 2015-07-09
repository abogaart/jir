'use strict';

var expect = require('chai').expect;
var chalk  = require('chalk');
var log = require('../lib/util/log.js');

describe('Log utils', function() {
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
  it('log info', function() {
    var args = hijackConsoleLog(function() {
      log.info('Hello world');
      log.info('Hello %s', 'world');
    });

    var info = chalk.grey('Jir:');
    expect(args[0][0]).to.equal(info + ' Hello world');
    expect(args[1][0]).to.equal(info + ' Hello %s');
    expect(args[1][1][0]).to.equal(chalk.blue('world'));
  });

  it('log warning', function() {
    var args = hijackConsoleLog(function() {
      log.warn('Hello world');
      log.warn('Hello %s', 'world');
    });

    var warn = chalk.yellow('Warning:');
    expect(args[0][0]).to.equal(warn + ' Hello world');
    expect(args[1][0]).to.equal(warn + ' Hello %s');
    expect(args[1][1][0]).to.equal(chalk.blue('world'));
  });

  it('log error no-args', function() {
    var args = hijackConsoleLog(function() {
      log.error();
    });
    expect(args.length).to.equal(0);
  });

  it('log error from string', function() {
    var args = hijackConsoleLog(function() {
      log.error('Hello world');
      log.error('Hello world', 'moon');
      log.error('Hello %s', 'world');
    });

    var err = chalk.red('Error:');
    expect(args[0][0]).to.equal(err + ' Hello world');
    expect(args[1][0]).to.equal(err + ' Hello world');
    expect(args[1][1]).to.be.undefined;

    expect(args[2][0]).to.equal(err + ' Hello %s');
    expect(args[2][1][0]).to.equal(chalk.blue('world'));
  });

  it('log error from error object', function() {
    var error1 = new Error('error 1');
    var error2 = new TypeError('error 2');
    var error3 = new Error('error %s');
    var args = hijackConsoleLog(function() {
      log.error(error1);
      log.error(error2);
      log.error(error2, '2');
      log.error(error3, '3');
    });

    var err = chalk.red('Error:');
    expect(args[0][0]).to.equal(err + ' error 1');
    expect(args[1][0]).to.equal(chalk.red('Type:') + '  Error');
    expect(args[2][0]).to.equal(chalk.red('Stack:'));

    expect(args[4][0]).to.equal(err + ' error 2');
    expect(args[5][0]).to.equal(chalk.red('Type:') + '  TypeError');

    expect(args[8][0]).to.equal(err + ' error 2');
    expect(args[8][1]).to.be.undefined;

    expect(args[12][0]).to.equal(err + ' error %s');
    expect(args[12][1][0]).to.equal(chalk.blue('3'));
  });

  it('log error from string and error object', function() {
    var error1 = new Error('error 1');
    var args = hijackConsoleLog(function() {
      log.error('error 1', error1);
      log.error('error %s', error1, '1');
    });

    var err = chalk.red('Error:');
    expect(args[0][0]).to.equal(err + ' error 1');
    expect(args[1][0]).to.equal(chalk.red('Type:') + '  Error');
    expect(args[2][0]).to.equal(chalk.red('Stack:'));

    expect(args[4][0]).to.equal(err + ' error %s');
    expect(args[4][1][0]).to.equal(chalk.blue(1));
    expect(args[6][0]).to.equal(chalk.red('Stack:'));
  });
});

function hijackConsoleLog(action) {
  var consoleLog = console.log;
  var args = [];
  console.log = function() {
    args.push(arguments);
  };
  action();
  console.log = consoleLog;
  return args;
}