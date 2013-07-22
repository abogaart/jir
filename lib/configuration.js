'use strict';

var _            = require('underscore'),
    fs           = require('fs'),
    path         = require('path'),
    Seq          = require('seq'),
    shell        = require('shelljs'),
    tools        = require('./tools'),
    pjson        = require('./../package.json'),
    defaultConfig = require('./../config/configuration.json'),
    defaultSettings = require('./../config/settings.json');

var api = exports,
    settings = api.settings = {},
    config   = api.config   = {};

function readFile(path) {
    return function() {
        tools.debug('Start path read: %s', path);
        fs.readFile(path, 'utf8', this);
    };
}

function exists (path) {
    return function() {
        var next = this;
        tools.debug('Start path exists: %s', path);
        fs.exists(path, function(exists) {
            tools.debug('Path actually exists: %s', path);
            next(false, exists);
        });
    };
}

function createDir(path) {
    return function() {
        var next = this;
        fs.exists(path, function(exists) {
            if (!exists) {
                //create new directory
                tools.debug('Create folder %s', path);
                fs.mkdir(path, next);
            } else {
                next();
            }
        });
    };
}

function readFileIfExists(path) {
    return function() {
        var next = this;
        fs.exists(path, function(exists) {
            if (exists) {
                tools.debug('ReadFileIfExists actually exists: %s', path);
                fs.readFile(path, 'utf8', next);
            } else {
                tools.debug('ReadFileIfExists does not exist: %s', path);
                next(false);
            }
        });
    };
}

api.init = function(finish) {
    tools.debug('Init config');

    //setup version, paths to application dir, data dir and the settings file in the app dir
    settings.version = pjson.version;
    settings.userHomedir = process.env[(tools.isWin()) ? 'USERPROFILE' : 'HOME'];
    settings.homeDir = tools.isWin() ?
            path.join(process.env.APPDATA, 'Hippo', 'jir') :
            path.join(settings.userHomedir, '.jir');
    settings.dataDir = path.join(settings.homeDir, 'hippo-versions');
    settings.globalSettingsFile = path.join(settings.homeDir, 'settings.json');

    Seq()
        .seq(createDir(settings.homeDir))
        .seq(readFileIfExists(settings.globalSettingsFile))
        .seq(function(globalSettingsFile) {
            _.extend(config, defaultConfig);
            _.extend(settings, defaultSettings, JSON.parse(globalSettingsFile || '{}'));

            if (!shell.which(settings.gitExec)) {
                tools.die(tools.translate('die.no.git'), settings.gitExec);
            }

            if (!shell.which(settings.mvnExec)) {
                tools.die(tools.translate('die.no.mvn'), settings.mvnExec);
            }

            this();
        })
        .seq(exists(settings.dataDir))
        .seq(function(dataDirExists) {
            var cmd,
                next = this;

            if (!dataDirExists) {
                //Checkout application data
                tools.info(tools.translate('greeting'));
                cmd = settings.gitExec + ' clone ' + settings.gitRepositoryUrl + ' ' + settings.dataDir;
                tools.exec(cmd, function() {
                    settings.lastUpdate = new Date();
                    next();
                }, function(code) {
                    tools.die('Failed to check out hippo-versions using "' + cmd + '"');
                });
            } else {
                //check if repository needs update
                var now = new Date(),
                    lastUpdate = settings.lastUpdate ? new Date(settings.lastUpdate) : now,
                    updateOn = new Date(lastUpdate.getTime() + (settings.updateInterval * 60 * 60 * 1000));

                if (updateOn <= now) {
                    cmd = settings.gitExec + ' pull';
                    tools.exec(cmd, function() {
                        //TODO: Changes can be detected by executing the following and checking if the output is empty
                        //cmd = 'git fetch origin && git log HEAD..origin/master --oneline';
                        tools.info('Datafile has been updated, not sure if there are any changes though.');
                        settings.lastUpdate = now;
                    }, function(code) {
                        tools.warn('Failed to update hippo-versions using "' + cmd + '"');
                    }, next);
                } else {
                    next();
                }
            }
        })
        .seq(function() {
            var str = JSON.stringify(settings, null, 4);
            fs.writeFile(settings.globalSettingsFile, str, finish);
        });
/*
        .catch(function(err) {
            tools.die('Init failed for configuration', err);
        });
*/
};

//API
api.getConfig = function() {
    return config;
};

api.getSettings = function() {
    return settings;
};

api.getArchetypes = function() {
    if (_.isUndefined(config.archetypes)) {
        config.archetypes = JSON.parse(fs.readFileSync(path.join(settings.dataDir, 'archetypes.json'), 'utf8'));
        if (!settings.developer) {
            config.archetypes.items = _.reject(config.archetypes.items, function(archetype) {
                return archetype.developer;
            });
        }
    }
    return config.archetypes.items;
};
