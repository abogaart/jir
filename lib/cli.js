#!/usr/bin/env node

'use strict';

var program = require('commander'),
    prompt  = require('prompt'),
    colors  = require('colors'),
    tools   = require('./tools'),
    Seq     = require('seq'),
    jir     = require('./jir');

//load commmandline options
program
        .version('0.0.1')
        .option('-a, --anonymous', 'Anonymous checkouts')
        .option('-d, --dir <path>', 'Working directory');

program
        .command('archetype [version] [name]')
        .description('Checkout a new archetype')
        .action(function(version, name, options) {
            jir.archetype(version, name, function(exitCode) {
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

Seq()
    .seq(function() {
        jir.init(this);
    })
    .seq(function() {
        tools.debug('Parsing parameters');
        program.parse(process.argv);

        if (!program.args.length) {
            program.help();
        }
    });