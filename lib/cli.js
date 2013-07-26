#!/usr/bin/env node

'use strict';

var program = require('commander'),
    tools   = require('./common'),
    Jir     = require('./jir').Jir;

var jir = new Jir();

//load commmandline options
program
        .version(jir.settings.version)
        .option('-v, --verbose', 'Verbose output')
        .option('-d, --developer', 'Show snapshots, do checkouts over https.');
        //.option('-a, --anonymous', 'Anonymous checkouts')
        //.option('-d, --dir <path>', 'Working directory');

program
        .command('archetype [version] [path]')
        .description('Checkout a new archetype')
        .action(function(version, path, options) {
            jir.prepare();
            jir.archetype(version, path, function(exitCode) {
                process.exit(exitCode);
            });
        });

program
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ jir archetype 7.8');
            console.log('');
        });

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}
