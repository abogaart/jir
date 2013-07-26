'use strict';

var common = require('../lib/common.js'),
    path   = require('path');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.common = {
    'test exists' : function(test) {
        test.expect(3);
        test.ok(common.exists(__dirname));
        test.ok(common.exists(__filename));
        test.equal(common.exists(path.join(__dirname, 'nonexisting')), false);
        test.done();
    },

    'test versionAsInt' : function(test) {
        test.expect(6);
        test.equal(common.versionAsInt("1"), 10000, 'should be 10000.');
        test.equal(common.versionAsInt("1.0"), 10000, 'should be 10000.');
        test.equal(common.versionAsInt("1.1"), 10100, 'should be 10100.');
        test.equal(common.versionAsInt("1.25"), 12500, 'should be 12500.');
        test.equal(common.versionAsInt("1.00.00"), 10000, 'should be 10000.');
        test.equal(common.versionAsInt("1.25.10"), 12510, 'should be 12510.');
        test.done();
    },

    'escape commandline parameter' : function(test) {
        test.expect(3);
        test.equal(common.escape('escape-me'), 'escape-me');
        test.equal(common.escape('escape me'), 'escape\\ me');
        test.equal(common.escape('escape" me'), 'escape\\"\\ me');
        test.done();
    },

    'simple format' : function(test) {
        test.expect(6);
        test.equal(common.format(null), null);
        test.equal(common.format(''), '');
        test.equal(common.format('format me'), 'format me');
        test.equal(common.format('format %s', ['me']), 'format me');
        test.equal(common.format('format %s now', ['me']), 'format me now');
        test.equal(common.format('%s me %s', ['format', 'now']), 'format me now');
        test.done();
    },

    'custom format' : function(test) {
        test.expect(1);
        test.equal(common.format('format %s now', ['me'], function(value, param) {
            if (param !== null) {
                value += '-' + param + '-';
            }
            return value;
        }), 'format -me- now');
        test.done();
    }
};
