/*jshint node:true, eqnull:true, laxcomma:true, undef:true, indent:2, camelcase:false, unused:true */
'use strict';

var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var nib = require('nib');
var rimraf = require('gulp-rimraf');
var connect = require('gulp-connect');


//  -- cleaning output dir --
gulp.task('clean', function () {
  gulp
    .src('./output/**/*')
    .pipe(
      rimraf({
        read: false
      })
    );
});


//  -- compiling jade files --
gulp.task('templates', function () {
  gulp
    .src('./template/*.jade')
    .pipe(
      jade({
      'pretty': false
      })
    )
    .pipe(
      gulp.dest('./output')
    )
    .pipe(
      connect.reload()
    );
});


//  -- compiling stylus files --
gulp.task('styles', function () {
  gulp.src('./template/static/css/*.styl')
    .pipe(
      stylus({
        use: nib(),
        compress: true
      })
    )
    .pipe(
      gulp.dest('./output/static/css')
    )
    .pipe(
      connect.reload()
    );
});


//  -- move images --
gulp.task('images', function () {
  gulp
    .src('./template/static/img/**/*')
    .pipe(
      gulp.dest('./output/static/img')
    )
    .pipe(
      connect.reload()
    );
});


//  -- move fonts --
gulp.task('fonts', function () {
  gulp
    .src('./template/static/font/**/*')
    .pipe(
      gulp.dest('./output/static/font')
    )
    .pipe(
      connect.reload()
    );
});


//  -- server --
gulp.task('connect', function () {
  connect.server({
    root: ['./output'],
    port: process.env.PORT || 1337,
    livereload: true
  });
});


//  -- watch --
gulp.task('watch', function () {
  gulp
    .watch(
      ['./template/**/*.jade'], 
      ['templates']
    );
  gulp
    .watch(
      ['./template/static/css/**/*.styl'], 
      ['styles']
    );
});

//  -- magic! --
gulp.task('default', ['clean', 'templates', 'styles', 'images', 'fonts', 'connect', 'watch']);