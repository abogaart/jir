'use strict';

var expect  = require('chai').expect;
var strings = require('./strings.js');
var chalk   = require('chalk');

describe('String utils', function() {
  describe('#isEmpty', function() {
    it('should return true if string is empty', function() {
      expect(strings.isEmpty(undefined)).to.be.true;
      expect(strings.isEmpty(null)).to.be.true;
      expect(strings.isEmpty('')).to.be.true;
      expect(strings.isEmpty(' ')).to.not.be.true;
    });
  });

  describe('#isBlank', function() {
    it('should return true for undefined and null', function() {
      expect(strings.isBlank(undefined)).to.be.true;
      expect(strings.isBlank(null)).to.be.true;
    });
    it('should return true if string contains solely whitespace char(s)', function() {
      expect(strings.isBlank('')).to.be.true;
      expect(strings.isBlank(' ')).to.be.true;
      expect(strings.isBlank('  ')).to.be.true;
      expect(strings.isBlank('  \n')).to.be.true;
      expect(strings.isBlank('\t')).to.be.true;
    });
    it('should return false if string contains non-whitespace char(s)', function() {
      expect(strings.isBlank('  s')).to.not.be.true;
    });
  });

  describe('#format', function() {
    it('should return "" for empty values (including undefined and null)', function() {
      expect(strings.format()).to.equal('');
      expect(strings.format(undefined)).to.equal('');
      expect(strings.format(null)).to.equal('');
      expect(strings.format('')).to.equal('');
    });

    it('should return input untouched if no parameters specified', function() {
      expect(strings.format('test')).to.equal('test');
      expect(strings.format('test %s')).to.equal('test %s');
      expect(strings.format('test', [])).to.equal('test');
    });

    it('should return string with substituted values', function() {
      expect(strings.format('%s', 'test')).to.equal('test');
      expect(strings.format('%s', 'test1', 'test2')).to.equal('test1 test2');
      expect(strings.format('%s', ['test'])).to.equal('test');
      expect(strings.format('%s', ['test1', 'test2'])).to.equal('test1 test2');
      expect(strings.format('%s - %s', 'test1', 'test2')).to.equal('test1 - test2');
      expect(strings.format('%s - %s', ['test1', 'test2'])).to.equal('test1 - test2');
    });
  });

  describe('#colored', function() {
    it('should return undefined if color or parameters are missing', function() {
      expect(strings.colored()).to.equal(undefined);
      expect(strings.colored(chalk.blue)).to.equal(undefined);
    });
    it('should return empty array if parameters is an empty array', function() {
      expect(strings.colored(chalk.blue, [])).to.eql([]);
    });
    it('should return array with colored values', function() {
      var blue = chalk.blue;
      expect(strings.colored(blue, ['test'])).to.eql([blue('test')]);
      expect(strings.colored(blue, ['test1', 'test2'])).to.eql([blue('test1'), blue('test2')]);
    });
    it('should not set color if parameter value is already colored', function() {
      expect(strings.colored(chalk.blue, ['test1', chalk.yellow('test2')]))
        .to.eql([chalk.blue('test1'), chalk.yellow('test2')]);
    });
  });
  describe('#translate', function() {
    it('should translate empty values to an empty string', function() {
      expect(strings.translate(undefined)).to.equal('');
      expect(strings.translate(null)).to.equal('');
      expect(strings.translate('')).to.equal('');
      expect(strings.translate(' ')).to.equal(' ');
    });

    it('should translate string with colored parameters', function() {
      expect(strings.translate('hello')).to.equal('hello');
      expect(strings.translate('hello %s', 'world')).to.equal('hello ' + chalk.red('world'));
      expect(strings.translate('hello %s', chalk.blue, 'world')).to.equal('hello ' + chalk.blue('world'));
    });

    it('should return :i18n-key-not-found for a non existing key', function() {
      expect(strings.translate('i18n:')).to.equal(':i18n-key-not-found');
      expect(strings.translate('i18n:non.existing.key')).to.equal('non.existing.key:i18n-key-not-found');
    });

    it('should translate by key', function() {
      expect(strings.translate('i18n:test.0')).to.equal('test');

      expect(strings.translate('i18n:test.1')).to.equal('test %s');
      expect(strings.translate('i18n:test.1', 'this')).to.equal('test ' + chalk.red('this'));
      expect(strings.translate('i18n:test.1', chalk.blue, 'this')).to.equal('test ' + chalk.blue('this'));

      expect(strings.translate('i18n:test.2')).to.equal('test %s and %s');
      expect(strings.translate('i18n:test.2', 'this')).to.equal('test ' + chalk.red('this') + ' and %s');
      expect(strings.translate('i18n:test.2', 'this', 'that'))
        .to.equal('test ' + chalk.red('this') + ' and ' + chalk.red('that'));

      expect(strings.translate('i18n:test.2', chalk.green, 'this', 'that'))
        .to.equal('test ' + chalk.green('this') + ' and ' + chalk.green('that'));

      expect(strings.translate('i18n:test.2', chalk.green, 'this', chalk.yellow('that')))
        .to.equal('test ' + chalk.green('this') + ' and ' + chalk.yellow('that'));
    });
  });
});
