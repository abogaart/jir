'use strict';

var _       = require('lodash');
var chalk   = require('chalk');
var sh      = require('shelljs');
var path    = require('path');
var common  = require('./util/common');
var files   = require('./util/files');
var tpls    = require('./util/templates');
var strings = require('./util/strings');
var validation = require('./util/validation');
var ui      = require('./util/cli-ui');
var jir     = require('./jir');
var log     = require('./util/log');
var Q       = require('q');
var jircli  = exports;

// Die on shell errors
sh.config.fatal = true;

// Global options
var options = [
  {
    flags: '-v, --verbose',
    desc: 'Verbose output'
  },
  {
    flags: '-u, --update',
    desc: 'Force update'
  },
  {
    flags: '-C, --chdir <path>',
    desc: 'Change the working directory'
  }
];

var commands = [
  new Command('create', 'Create a new workspace', createWorkspace,
    'Workspace %s successfully created', 'Failed to create workspace %s')
];

jircli.init = function(args) {
  if (log.isDebug()) {
    log.debug('Running ' + chalk.blue(common.getAppVersion()));
    log.debug('Current working dir: ' + chalk.blue(args.chdir || sh.pwd()));
    if (args.verbose) {
      log.debug('Verbose output: ' + chalk.blue('on'));
    }
    if (args.update) {
      log.debug('Force update: ' + chalk.blue('on'));
    }
  }

  jir.init(args.verbose, args.update, args.chdir);

  if (jir.config.homeDirCreated) {
    log.info(strings.translate('app.welcome'));
  }
};

jircli.loadOptions = function(program) {
  options.forEach(function(option) {
    program.option(option.flags, option.desc);
  });
};

jircli.loadCommands = function(program, actionPromise) {
  commands.forEach(function(cmd) {
    program
      .command(cmd.name)
      .description(cmd.desc)
      .action(function() {
        var args = arguments;
        var executeAction = function() {
          return Q
            .try(function() {
              return cmd.action.apply(cmd, args);
            })
            .then(cmd.success)
            .catch(cmd.fail)
            .finally(cmd.complete);
        };
        actionPromise.resolve(executeAction);
      });
  });
};

/**
 * TODO: Command class
 *
 * @param name
 * @param description
 * @param action
 * @param success
 * @param fail
 * @param complete
 * @constructor
 */
function Command(name, description, action, success, fail, complete) {
  this.name = name;
  this.desc = description;
  this.startDir = sh.pwd();
  this.action = function() {
    if (this.startDir !== jir.config.pwd) {
      sh.cd(jir.config.pwd);
    }
    return action.apply(this, arguments);
  }.bind(this);

  this.success = function() {
    if (_.isFunction(success)) {
      success.apply(this, arguments);
    } else if (_.isString(success)) {
      [].splice.call(arguments, 0, 0, success);
      log.info.apply(log, arguments);
    } else {
      log.info('Command %s executed successfully', chalk.green(this.name));
    }
  }.bind(this);

  this.fail = function(error) {
    if (_.isFunction(fail)) {
      fail.apply(this, arguments);
    } else if (_.isString(fail)) {
      common.die(fail, error, this.name);
    } else {
      common.die('Failed to execute command %s', error, this.name);
    }
  }.bind(this);

  this.complete = function() {
    if (_.isFunction(complete)) {
      complete.apply(this, arguments);
    }
    sh.cd(this.startDir);
  }.bind(this);
}

function createWorkspace(options) {
  log.info('Create a new workspace');

  var data = {};

  return [chooseName, chooseFolder, create, finish].reduce(Q.when, Q(''));

  function chooseName() {
    var question = {
      name: 'name',
      message: strings.translate('i18n:workspace.create.new.name'),
      validate: function(name) {
        return validation.checkIfFolderExists(path.join(jir.config.pwd, name));
      }
    };
    return ui.ask(question, data);
  }

  function chooseFolder() {

  }

  function create() {
    log.debug('create %s', data.name);

    sh.mkdir(data.name);

    var template = tpls.createFromFile('aggregator-pom.tl', data);
    tpls.writeToFile(template, path.join(jir.config.pwd, data.name, 'pom.xml'));
  }

  function finish() {
    return data.name;
  }
}
