'use strict';

var _       = require('underscore'),
    program = require('commander'),
    colors  = require('colors'),
    Seq     = require('seq'),
    config  = require('./configuration'),
    tools   = require('./tools');

var api = exports;

api.init = function(callback) {
    config.init(callback);
};

api.archetype = function(version, name, finish) {
    var archetypes = config.getArchetypes(),
        maxMajorArchetypes = 3;

    if (!_.isArray(archetypes) || archetypes.length === 0) {
        tools.die('No archetypes found to be installed, please check if the configuration data is present at ' + config.settings.dataDir);
    }

    Seq()
        .seq(function() {
            var next = this;
            if (_.isUndefined(version)) {
                //present user with list of possible archetypes
                var latestMajorArchetypes = getLatestArchetypes(archetypes, maxMajorArchetypes);
                var chooseList = getArchetypesLabels(latestMajorArchetypes);
                if (archetypes.length > latestMajorArchetypes) {
                    chooseList.push('View all');
                }
                console.log('Choose a version');
                program.choose(chooseList, function(i) {
                    if (i === latestMajorArchetypes.length) {
                        //show all
                        tools.info('Show all');
                    } else {
                        next(false, latestMajorArchetypes[i]);
                    }
                });
            } else {
                version = version.toLowerCase();
                if (version === 'latest') {
                    next(false, archetypes[0]);
                }
            }
        })
        .seq(function(archetype) {
            tools.info('Creating archetype ' + archetype.id);
            this();
        }).seq(function() {
           finish(0);
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

