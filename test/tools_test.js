'use strict';

var tools = require('../lib/common.js');

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

exports['tools.versionAsInt'] = {
    setUp: function(done) {
        // setup here
        done();
    },
    'globals': function(test) {
        test.equal(tools.versionAsInt("1"), 10000, 'should be 10000.');
        test.equal(tools.versionAsInt("1.0"), 10000, 'should be 10000.');
        test.equal(tools.versionAsInt("1.1"), 10100, 'should be 10100.');
        test.equal(tools.versionAsInt("1.25"), 12500, 'should be 12500.');
        test.equal(tools.versionAsInt("1.00.00"), 10000, 'should be 10000.');
        test.equal(tools.versionAsInt("1.25.10"), 12510, 'should be 12510.');
        test.done();
    }
};
