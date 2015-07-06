'use strict';

var inquirer = require('inquirer');
var Q        = require('q');
var strings  = require('./strings');
var _        = require('lodash');
var ui       = exports;

// init prompt
/*
prompt.message = 'Jir: '.grey;
prompt.colors = false;
prompt.delimiter = '';
prompt.start();
*/

/**
 * ui.ask(String question (i18n optional), String propertyName, Object o)
 * ui.ask(Array questions, Object o)
 * ui.ask(Object question, Object o)
 *
 * @see https://www.npmjs.com/package/inquirer#question
 * @see https://www.npmjs.com/package/inquirer#question
 */
ui.ask = function() {
  var deferred = Q.defer();
  var questions, object;

  if (_.isString(arguments[0]) && _.isString(arguments[1])) {
    questions = [{
      name: arguments[1],
      message: strings.translate(arguments[0])
    }];
    object = arguments[2];
  } else {
    if (_.isArray(arguments[0])) {
      questions = arguments[0];
    } else {
      questions = [arguments[0]];
    }
    object = arguments[1];
  }

  if (_.isUndefined(object) || object === null) {
    object = {};
  }

  inquirer.prompt(questions, function(answers) {
    deferred.resolve(_.extend(object, answers));
  });

  return deferred.promise;
};

/*
ui.askYesNo = function(msg, def, warn) {
  warn = warn || strings.translate('ask.yesno.validation', 'yes', 'no');
  var property = {
    name: 'yesno',
    message: msg,
    default: def || 'yes'
  };
  return common.ask(property)
    .then(function(answer) {
      var yn = common.parseBool(answer.yesno);
      if (yn === null) {
        log.warn(warn);
        return common.askYesNo(msg, def, warn);
      }
      return yn;
    });
};
*/
