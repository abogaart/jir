'use strict';

var expect  = require('chai').expect;
var strings = require('../lib/util/strings.js');
var chalk   = require('chalk');

describe('String utils', function() {
  it('string is empty', function() {
    expect(strings.isEmpty(undefined)).to.be.true;
    expect(strings.isEmpty(null)).to.be.true;
    expect(strings.isEmpty('')).to.be.true;
    expect(strings.isEmpty(' ')).to.not.be.true;
  });

  it('string is blank', function() {
    expect(strings.isBlank(undefined)).to.be.true;
    expect(strings.isBlank(null)).to.be.true;
    expect(strings.isBlank('')).to.be.true;
    expect(strings.isBlank(' ')).to.be.true;
    expect(strings.isBlank('  ')).to.be.true;
    expect(strings.isBlank('  s')).to.not.be.true;
  });

  it('format', function() {
    expect(strings.format()).to.equal('');
    expect(strings.format(undefined)).to.equal('');
    expect(strings.format(null)).to.equal('');
    expect(strings.format('')).to.equal('');

    expect(strings.format('test')).to.equal('test');
    expect(strings.format('%s', 'test')).to.equal('test');
    expect(strings.format('%s', ['test'])).to.equal('test');
    expect(strings.format('%s - %s', 'test1', 'test2')).to.equal('test1 - test2');
    expect(strings.format('%s - %s', ['test1', 'test2'])).to.equal('test1 - test2');
  });

  it('colored', function() {
    var blue = chalk.blue;
    expect(strings.colored()).to.equal(undefined);
    expect(strings.colored(blue)).to.equal(undefined);
    expect(strings.colored(blue, [])).to.deep.equal([]);
    expect(strings.colored(blue, ['test'])).to.deep.equal([blue('test')]);
    expect(strings.colored(blue, ['test1', 'test2'])).to.deep.equal([blue('test1'), blue('test2')]);
    expect(strings.colored(blue, ['test1', chalk.yellow('test2')]))
      .to.deep.equal([blue('test1'), chalk.yellow('test2')]);
  });

  it('translate empty values', function() {
    expect(strings.translate(undefined)).to.equal('');
    expect(strings.translate(null)).to.equal('');
    expect(strings.translate('')).to.equal('');
    expect(strings.translate(' ')).to.equal(' ');
  });

  it('translate with colored parameters', function() {
    expect(strings.translate('hello')).to.equal('hello');
    expect(strings.translate('hello %s', 'world')).to.equal('hello ' + chalk.red('world'));
    expect(strings.translate('hello %s', chalk.blue, 'world')).to.equal('hello ' + chalk.blue('world'));
  });

  it('translate by non existing key', function() {
    expect(strings.translate('i18n:')).to.equal(':i18n-key-not-found');
    expect(strings.translate('i18n:non.existing.key')).to.equal('non.existing.key:i18n-key-not-found');
  });

  it('translate by key', function() {
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
