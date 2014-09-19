/*jshint node:true, eqnull:true, laxcomma:true, undef:true, indent:2, camelcase:false, unused:true */
'use strict';

//  -- requirements --
var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var nib = require('nib');
var rimraf = require('gulp-rimraf');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');


//  -- paths for everything we need! --
var config = {
  sources: {
    'jade': [
      ['template/*.jade', '!template/layout.jade', 'template/**/*.jade'],
      'template/**/*.jade'
    ],
    'stylus': ['template/static/css/*.styl'], 
    'images': ['template/static/img/**/*'] ,
    'javascripts': ['template/static/js/**/*'],
    'fonts': ['template/static/font/**/*']
  },
  outputs: {
    'base': 'output',
    'css': 'output/static/css',
    'img': 'output/static/img',
    'js': 'output/static/js',
    'font': 'output/static/font'
  }
};


//  -- cleaning output dir --
gulp.task('clean', function () {
  return gulp
    .src(
      config.outputs.font,
      config.outputs.js,
      config.outputs.img,
      config.outputs.css,
      config.outputs
    )
    .pipe(
      rimraf({
        read: false
      })
    );
});


//  -- compiling jade files --
gulp.task('templates', function () {
  return gulp
    .src(config.sources.jade[0], {path: './'})
    .pipe(
      jade({
      'pretty': false
      })
    )
      .on('error', function (err) {
        gutil.log('\n === jade error!! ===\n', gutil.colors.red(err));
        this.emit('end');
      })
    .pipe(
      gulp.dest(config.outputs.base)
    )
    .pipe(
      connect.reload()
    );
});


//  -- compiling stylus files --
gulp.task('styles', function () {
  return gulp
    .src(config.sources.stylus, {path: './'})
    .pipe(
      stylus({
        use: nib(),
        compress: true
      })
    )
      .on('error', function (err) {
        gutil.log('\n === stylus error!! ===\n', gutil.colors.cyan(err));
        this.emit('end');
      })
    .pipe(
      gulp.dest(config.outputs.css)
    )
    .pipe(
      connect.reload()
    );
});


//  -- move images --
gulp.task('images', function () {
  return gulp
    .src(config.sources.images, {path: './'})
    .pipe(
      gulp.dest(config.outputs.img)
    )
    .pipe(
      connect.reload()
    );
});


//  -- move js --
gulp.task('javascripts', function () {
  return gulp
    .src(config.sources.javascripts, {path: './'})
    .pipe(
      uglify()
    )
      .on('error', function (err) {
        gutil.log('\n === js error!! ===\n', gutil.colors.yellow(err));
        this.emit('end');
      })
    .pipe(
      gulp.dest(config.outputs.js)
    )
    .pipe(
      connect.reload()
    );
});


//  -- move fonts --
gulp.task('fonts', function () {
  return gulp
    .src(config.sources.fonts, {path: './'})
    .pipe(
      gulp.dest(config.outputs.font)
    )
    .pipe(
      connect.reload()
    );
});


//  -- server --
gulp.task('connect', function () {
  connect.server({
    root: ['output'],
    port: process.env.PORT || 1337,
    livereload: true
  });
});


//  -- watch file changes --
gulp.task('watch', function () {
  gulp
    .watch(
      [config.sources.jade[1]], 
      ['templates']
    );
  gulp
    .watch(
      [config.sources.stylus], 
      ['styles']
    );
  gulp
    .watch(
      [config.sources.images], 
      ['images']
    );
  gulp
    .watch(
      [config.sources.javascripts], 
      ['javascripts']
    );
  gulp
    .watch(
      [config.sources.fonts], 
      ['fonts']
    );
});


//  -- magic! --
gulp.task('default', ['clean', 'templates', 'styles', 'images', 'javascripts', 'fonts', 'connect', 'watch']);