'use strict';
var _            = require('underscore'),
    fs           = require('fs'),
    Seq          = require('seq'),
    tools        = require('./tools');

var api = exports,
    settings = api.settings = JSON.parse(fs.readFileSync('config/settings.json', 'utf8')),
    config   = api.config   = JSON.parse(fs.readFileSync('config/configuration.json', 'utf8'));

api.init = function(finish) {
    var settingsDirty = false;

    settings.homeDir = getJirHome();
    settings.dataDir = getDataDir();
    settings.globalFile = tools.path(settings.homeDir, 'settings.json');

    Seq()
        .seq(function() {
            if (!fs.existsSync(settings.homeDir)) {
                //create new app home directory
                tools.info('Initial setup');
                fs.mkdirSync(settings.homeDir);
            } else {
                if (fs.existsSync(settings.globalFile)) {
                    //TODO: Better to augment
                    settings = JSON.parse(fs.readFileSync(settings.globalFile, 'utf8'));
                }
            }
            this();
        })
        .seq(function() {
            var cmd,
                next = this;

            if (!fs.existsSync(settings.dataDir)) {
                //Checkout application data
                tools.info('Checking out versions data');
                cmd = settings.gitExec + ' clone ' + settings.gitRepositoryUrl + ' ' + settings.dataDir;
                tools.exec(cmd, function() {
                    settings.lastUpdate = new Date();
                    settingsDirty = true;
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
                        settingsDirty = true;
                    }, function(code) {
                        tools.warn('Failed to update hippo-versions using "' + cmd + '"');
                    }, next);
                } else {
                    next();
                }
            }
        })
        .seq(function() {
            if (settingsDirty) {
                fs.writeFileSync(settings.globalFile, JSON.stringify(settings, null, 4));
            }
            finish();
        })
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
        var path = tools.path(settings.dataDir, 'archetypes.json');
        config.archetypes = JSON.parse(fs.readFileSync(path, 'utf8'));
    }
    return config.archetypes.items;
};

// Utility functions
function getUserHome() {
    return process.env[(isWin()) ? 'USERPROFILE' : 'HOME'];
}

function isWin() {
    return process.platform == 'win32';
}

function getJirHome() {
    return isWin() ? process.env['APPDATA'] + '\\Hippo\\jir' : getUserHome() + '/.jir';
}

function getDataDir() {
    return getJirHome() + (isWin() ? '//hippo-versions' : '/hippo-versions');
}
