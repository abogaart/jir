'use strict';

var _        = require('underscore')._,
    program  = require('commander'),
    sh    = require('shelljs'),
    Seq      = require('seq'),
    path     = require('path'),
    Settings = require('./settings').Settings,
    common   = require('./common'),
    log      = require('./log');

require('colors');

var Jir = exports.Jir = function (options) {
    if (common.isDebug()) {
        log.debug('Running ' +  common.getAppVersion().blue);
    }
    this.settings = new Settings();
};

Jir.prototype.archetype = function(version, folder, finish) {
    var jir = this,
        archetypes = this.settings.getArchetypes(),
        install = {
            name : this.settings.defaultArchetype.projectName,
            pkg : this.settings.defaultArchetype.pkg,
            artifact : this.settings.defaultArchetype.artifactId,
            group : this.settings.defaultArchetype.groupId,
            version : this.settings.defaultArchetype.version,
            archetype : null,
            path : null
        },
        maxMajorArchetypes = this.settings.maxMajorArchetypes || 3;

    if (!_.isArray(archetypes) || archetypes.length === 0) {
        common.die('No archetypes found to be installed, please check if the configuration data is present at %s', jir.settings.dataDir);
    }

    Seq()
        .seq(function() {
            if (_.isUndefined(version)) {
                //present user with list of possible archetypes
                var next = this,
                    latest = jir.getLatestArchetypes(archetypes, maxMajorArchetypes),
                    options = jir.getArchetypesLabels(latest);

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
                        program.choose(jir.getArchetypesLabels(archetypes), function(i) {
                            console.log('');
                            install.archetype = archetypes[i];
                            next();
                        });
                    } else {
                        console.log('');
                        install.archetype = latest[i];
                        next();
                    }
                });
            } else {
                version = version.toLowerCase();
                if (version === 'latest') {
                    install.archetype = archetypes[0];
                    this();
                } else {

                    log.info('TODO: implement custom version');
                }
            }
        })
        .seq(function() {
            log.info('Preparing to install %s', install.archetype.id);

            folder = _.isString(folder) ? folder : install.archetype.id;
            install.path = path.resolve(folder);

            var msg = common.translate('archetype.mvn.data', install.name, install.pkg, install.artifact, install.group, install.version, install.path);
            msg += '\n\nJir:'.grey + ' Are the settings correct? '; //tailing space is important here
            common.confirm(msg, function(confirmed) {
                if (confirmed) {
                    this(false);
                } else {
                    common.interview(
                        [
                            { id: 'name', label: '   - Name (' + install.name.blue + '): '},
                            { id: 'pkg', label: '   - Package (' + install.pkg.blue + '): '},
                            { id: 'artifact', label: '   - ArtifactId (' + install.artifact.blue + '): '},
                            { id: 'group', label: '   - GroupId (' + install.group.blue + '): '},
                            { id: 'version', label: '   - Version (' + install.version.blue + '): '},
                            { id: 'path', label: '   - Folder name (' + path.basename(install.path).blue + '): '}
                        ],
                        install,
                        this
                    );
                }
            }.bind(this));
        })
        .seq(function() {
            var getFolder = function(next) {
                if (common.exists(path.resolve(install.path))) {
                    var folderName = path.basename(install.path),
                        parentFolder = path.dirname(install.path);

                    log.info(common.translate('folder.already.exists'), parentFolder, folderName);
                    common.prompt('New name: ', function(newName) {
                        install.path = path.join(parentFolder, newName);
                        getFolder(next);
                    });
                } else {
                    next();
                }
            };
            getFolder(this);
        })
        .seq(function() {
            var mvn,
                cur = sh.pwd(),
                tmp = sh.tempdir(),
                cmd = common.format('mvn archetype:generate -DarchetypeRepository=http://maven.onehippo.com/maven2 -DarchetypeGroupId=%s -DarchetypeArtifactId=%s -DarchetypeVersion=%s -DprojectName=%s -Dpackage=%s -DartifactId=%s -DgroupdId=%s -Dversion=%s -DinteractiveMode=false',
                            [install.archetype.groupId, install.archetype.artifactId, install.archetype.version,
                            common.escape(install.name), common.escape(install.pkg), common.escape(install.artifact),
                            common.escape(install.group), common.escape(install.version)]); //yuck

            sh.cd(tmp);

            log.debug('Executing mvn %s', cmd);
            mvn = sh.exec(cmd, {silent: !jir.settings.verbose});

            if (mvn.code === 0) {
                sh.mv(path.join(tmp, install.artifact), install.path);
                sh.cd(cur);
                log.info('Hippo archetype %s was successfully created in folder %s', install.archetype.name, install.path);
                finish(0);
            } else {
                sh.cd(cur);
                common.die(common.translate('archetype.mvn.die'), mvn.output);
            }
        });
};

Jir.prototype.prepare = function() {
    this.settings.override(program);
};

Jir.prototype.getLatestArchetypes = function (archetypes, maxMajorArchetypes) {
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
};

Jir.prototype.getArchetypesLabels = function getArchetypesLabels(archetypes) {
    var labels = [];

    _.each(archetypes, function(archetype) {
        labels.push(archetype.label);
    });
    return labels;
};

