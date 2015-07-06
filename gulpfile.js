'use strict';

var gulp = require('gulp');
var notify = require('gulp-notify');
var util = require('gulp-util');
var jscs = require('gulp-jscs');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');

gulp.task('jscs', function() {
  gulp.src('lib/**.js')
    .pipe(jscs())
    .pipe(notify({
      title: 'JSCS',
      message: 'JSCS Passed. Let it fly!'
    }));
});

gulp.task('lint', function() {
  gulp.src('lib/**.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('build', ['jscs', 'lint'], function() {
  gulp.src('/')
    .pipe(notify({
      title: 'Task Builder',
      message: 'Jir build finished'
    }));
});

gulp.task('test', function() {
  return gulp.src(['test/**.js'], {read: false})
    .pipe(mocha({reporter: 'spec'}))
    .on('error', util.log);
});
