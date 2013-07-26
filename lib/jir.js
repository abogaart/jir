'use strict';

var _        = require('underscore'),
    program  = require('commander'),
    shell    = require('shelljs'),
    fs       = require('fs'),
    Seq      = require('seq'),
    path     = require('path'),
    Settings = require('./settings').Settings,
    common   = require('./common'),
    log      = require('./log');

var Jir = exports.Jir = function (options) {
    if (common.isDebug()) {
        log.debug('Running ' +  common.getAppVersion().blue);
    }
    this.settings = new Settings();
};

function getLatestArchetypes(archetypes, maxMajorArchetypes) {
    var latest = [],
        major = null;

    _.each(archetypes, function(archetype) {
        if (latest.length < maxMajorArchetypes) {
            if (major === null || common.versionAsInt(archetype.major) < common.versionAsInt(major)) {
                latest.push(archetype);
                major = archetype.major;
            }
        }
    });
    return latest;
}

function getArchetypesLabels(archetypes) {
    var labels = [];

    _.each(archetypes, function(archetype) {
        labels.push(archetype.label);
    });
    return labels;
}

Jir.prototype.archetype = function(version, folder, finish) {
    var archetypes = this.settings.getArchetypes(),
        archetype  = null,
        installPath = null,
        settings = this.settings,
        maxMajorArchetypes = settings.maxMajorArchetypes || 3;

    if (!_.isArray(archetypes) || archetypes.length === 0) {
        common.die('No archetypes found to be installed, please check if the configuration data is present at ' + settings.dataDir);
    }

    Seq()
        .seq(function() {
            if (_.isUndefined(version)) {
                //present user with list of possible archetypes
                var next = this,
                    latest = getLatestArchetypes(archetypes, maxMajorArchetypes),
                    options = getArchetypesLabels(latest);

                if (archetypes.length > latest.length) {
                    options.push('View all');
                }
                log.info(common.translate('archetypes.major', maxMajorArchetypes));
                program.choose(options, function(i) {
                    if (i === latest.length) {
                        //show all
                        console.log('');
                        log.info(common.translate('archetypes.all'));
                        console.log('');
                        program.choose(getArchetypesLabels(archetypes), function(i) {
                            console.log('');
                            archetype = archetypes[i];
                            next();
                        });
                    } else {
                        console.log('');
                        archetype = latest[i];
                        next();
                    }
                });
            } else {
                version = version.toLowerCase();
                if (version === 'latest') {
                    archetype = archetypes[0];
                    this();
                } else {
                    log.info('TODO: implement custom version');
                }
            }
        })
        .seq(function() {
            var getFolder = function(next) {
                fs.exists(path.join(installPath), function(exists) {
                    if (exists) {
                        var folderName = path.basename(installPath),
                            parentFolder = path.dirname(installPath);

                        log.info('The folder %s already contains a folder named %s, please enter a new name.', parentFolder, folderName);
                        program.prompt('Jir:'.grey + ' New name: ', function(newName) {
                            //console.log('');
                            installPath = path.join(parentFolder, newName);
                            getFolder(next);
                        });
                    } else {
                        next();
                    }
                });
            };

            folder = _.isString(folder) ? folder : archetype.id;
            installPath = path.resolve(folder);

            log.info('Preparing to install %s in %s', archetype.id, installPath);
            getFolder(this);

        }).seq(function() {
            var data = {
                    projectName: settings.archetypeProjectName,
                    _package: settings.archetypePackage,
                    artifactId : settings.archetypeArtifactId,
                    groupId : settings.archetypeGroupId,
                    version : settings.archetypeVersion
                },
                msg = common.translate('archetype.mvn.data', data.projectName, data._package,
                    data.artifactId, data.groupId, data.version);
            msg += '\n\nJir:'.grey + ' Are the settings correct? '; //tailing space is important here
            program.confirm(msg, function(confirmed) {
                if (confirmed) {
                    this(false, data);
                } else {
                    common.interview(
                        [
                            { id: 'projectName', label: 'Project name: '},
                            { id: '_package', label: 'Package: '},
                            { id: 'artifactId', label: 'ArtifactId: '},
                            { id: 'groupId', label: 'GroupId: '},
                            { id: 'version', label: 'Version: '}
                        ],
                        this
                    );
                }
            }.bind(this));
        })
        .seq(function(data) {
            var mvn,
                cur = shell.pwd(),
                tmp = shell.tempdir(),
                cmd = common.format('mvn archetype:generate -DarchetypeRepository=http://maven.onehippo.com/maven2 -DarchetypeGroupId=%s -DarchetypeArtifactId=%s -DarchetypeVersion=%s -DprojectName=%s -Dpackage=%s -DartifactId=%s -DgroupdId=%s -Dversion=%s -DinteractiveMode=false',
                        [archetype.groupId, archetype.artifactId, archetype.version,
                        common.escape(data.projectName), data._package, data.artifactId, data.groupId, data.version]);

            shell.cd(tmp);

            log.debug('Executing mvn %s', cmd);
            mvn = shell.exec(cmd, {silent: !settings.verbose});

            if (mvn.code === 0) {
                shell.mv(path.join(tmp, data.artifactId), installPath);
                shell.cd(cur);
                log.info('Hippo archetype %s was successfully created in folder %s', archetype.name, installPath);
                finish(0);
            } else {
                shell.cd(cur);
                shell.rm('-rf', tmp);
                //TODO: save error msg
                common.die(common.translate('archetype.mvn.die'), mvn.output);
            }
        });
};

Jir.prototype.prepare = function() {
    this.settings.override(program);
};