'use strict';

var _       = require('underscore'),
    program = require('commander'),
    colors  = require('colors'),
    Seq     = require('seq'),
    path    = require('path'),
    fs      = require('fs'),
    config  = require('./configuration'),
    tools   = require('./tools');

var api = exports;

api.init = function(callback) {
    console.log('Running ' + 'jir'.blue + ' ' + tools.getAppVersion().blue + '\n');
    config.init(function() {
        callback();
    });
};

function getLatestArchetypes(archetypes, maxMajorArchetypes) {
    var latest = [],
            major = null;
    _.each(archetypes, function(archetype) {
        if (latest.length < maxMajorArchetypes) {
            if (major === null || tools.versionAsInt(archetype.major) < tools.versionAsInt(major)) {
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

api.archetype = function(version, folder, finish) {
    var archetypes = config.getArchetypes(),
        archetype = null,
        maxMajorArchetypes = 3;

    if (!_.isArray(archetypes) || archetypes.length === 0) {
        tools.die('No archetypes found to be installed, please check if the configuration data is present at ' + config.settings.dataDir);
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
                tools.info('Showing latest %s major versions, please choose one or view all', maxMajorArchetypes);
                program.choose(options, function(i) {
                    if (i === latest.length) {
                        //show all
                        console.log('');
                        tools.info('Showing all versions, please choose one');
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
                    tools.info('TODO: implement custom version');
                }
            }
        })
        .seq(function() {
            var getFolder = function(dir, next) {
                fs.exists(path.join(dir, folder), function(exists) {
                    if (exists) {
                        //console.log('');
                        tools.info('The current folder already contains a folder named %s, please enter a new name.', folder);
                        program.prompt('New name: ', function(newName) {
                            console.log('');
                            folder = newName;
                            getFolder(dir, next);
                        });
                    } else {
                        next();
                    }
                });
            };

            folder = _.isString(folder) ? folder : archetype.id;
            tools.info('Installing archetype %s in %s', archetype.id, path.join(process.cwd(), folder));
            getFolder(process.cwd(), this);

        }).seq(function() {
            var cmd = 'mvn archetype:generate -DarchetypeRepository=http://maven.onehippo.com/maven2 -DarchetypeGroupId=org.onehippo.cms7 -DarchetypeArtifactId=hippo-archetype-website -DarchetypeVersion=' + archetype.version + ' -DartifactId=' + folder + ' -DinteractiveMode=false';
            tools.exec(cmd, function() {
                finish(0);
            });
        });
};

