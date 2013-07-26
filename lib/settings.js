'use strict';

var _            = require('underscore')._,
    path         = require('path'),
    shell        = require('shelljs'),
    common       = require('./common'),
    Git          = common.Git,
    log          = require('./log');
    //settings     = require('./../config/settings.json');

var cache = {};

function exists(_path) {
    return shell.test('-e', _path);
}

function getFileIfExists(_path) {
    return exists(_path) ? shell.cat(_path) : false;
}

function readJSON(_path) {
    return JSON.parse(getFileIfExists(_path) || '{}');
}

function writeJSON(_o, _path) {
    JSON.stringify(_o, null, 4).to(_path);
}

function getExpireTime(lastUpdate, hourlyInterval) {
    return new Date(lastUpdate).getTime() + (hourlyInterval * 60 * 60 * 1000);
}

var Settings = exports.Settings = function (options) {
    options = options || {};

    common.format('');

    var settings = require('./../config/settings.json');

    // Get version from package.json
    settings.version = common.getAppVersion();

    // Setup paths to application dir, data dir and the settings file in the app dir
    settings.homeDir        = common.isWin() ?
                                path.join(process.env.APPDATA, 'Hippo', 'jir') :
                                path.join(process.env.HOME, '.jir');
    settings.dataDir        = path.join(settings.homeDir, 'hippo-versions');
    settings.settingsFile   = path.join(settings.homeDir, 'settings.json');
    settings.updateFile     = path.join(settings.homeDir, 'update.json');

    // If application home dir is not present, create one and welcome the user
    if (!exists(settings.homeDir)) {
        log.info(common.translate('app.welcome'));

        log.debug('Create folder %s', settings.homeDir);
        shell.mkdir(settings.homeDir);

        //write settings to disk
        writeJSON(settings, settings.settingsFile);
    } else {
        // Initialize settings with priority: project settings -> global settings -> default settings
        _.extend(settings, readJSON(settings.settingsFile));
    }

    if (!exists(settings.updateFile)) {
        //create new update file
        writeJSON({ lastUpdate : null, lastChanged : null }, settings.updateFile);
    }


    // Ensure Git is installed
    if (!shell.which(settings.gitExec)) {
        common.die(common.translate('die.no.git'), settings.gitExec);
    }
    // Ensure Maven3 is installed
    if (!shell.which(settings.mvnExec)) {
        common.die(common.translate('die.no.mvn'), settings.mvnExec);
    }

    // Check if hippo-versions is present or needs to be updated
    this.checkVersionsData(settings);

    // Expose settings properties to new Settings instance
    _.extend(this, settings);
};

Settings.prototype.checkVersionsData = function(settings) {
    var update = readJSON(settings.updateFile),
        now = new Date(),
        git = new Git(settings.gitExec, {silent: !settings.verbose}),
        curDir;

    if (!settings.skipUpdate) {

        if (!exists(settings.dataDir)) {
            // Clone the versions project into the data directory
            if (!git.exec('clone ' + settings.gitRepositoryUrl + ' ' + settings.dataDir)) {
                common.die('Failed to checkout hippo-versions using %s', git.cmd);
            }

            update.lastUpdate = now;
            update.lastChanged = now;
            writeJSON(update, settings.updateFile);

        } else {
            // Check if we need to update. Ugly onliner.. settings.updateInterval is in hours.
            if (update.lastUpdate === null || getExpireTime(update.lastUpdate, settings.updateInterval) < now.getTime()) {
                log.debug('Last update was more than %s hour(s) ago, checking for updates.', settings.updateInterval);

                // Git does not really understand --git-dir, or I don't.. Probably the latter. Use a cd workaround here.
                curDir = shell.pwd();
                shell.cd(settings.dataDir);

                //update app data
                if (git.exec('fetch origin')) {
                    if (git.exec('log HEAD..origin/master --oneline')) {
                        if (!_.isEmpty(git.output) && git.exec('merge origin/master')) {
                            log.info(common.translate('data.updated'));
                            update.lastChanged = now;
                        }
                        update.lastUpdate = now;
                        writeJSON(update, settings.updateFile);
                    }
                } else {
                    log.debug('Probably no HTTP connection available');
                }

                // back to current dir
                shell.cd(curDir);
            }
        }
    }
};

Settings.prototype.getArchetypes = function() {
    if (_.isUndefined(cache.archetypes)) {
        cache.archetypes = readJSON(path.join(this.dataDir, 'archetypes.json'));
        if (!this.developer) {
            cache.archetypes.items = _.reject(cache.archetypes.items, function(archetype) {
                return archetype.developer;
            });
        }
    }
    return cache.archetypes.items;
};

Settings.prototype.override = function(o) {
    this.verbose = o.verbose || this.verbose;
    this.developer = o.developer || this.developer;

    log.debug('Options: verbose=%s, developer=%s', this.verbose, this.developer);
};