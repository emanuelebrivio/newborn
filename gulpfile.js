/*jshint node:true, eqnull:true, laxcomma:true, undef:true, indent:2, camelcase:false, unused:true */
'use strict';

//  -- packages required --
var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var nib = require('nib');
var del = require('del');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var deploy = require('gulp-gh-pages');



//  -- cleaning all items in output --
gulp.task('clean-all', function (cb) {
  del(['output'], cb);
});
//  -- cleaning compiled templates --
gulp.task('clean-templates', function (cb) {
  del(['output/*.html', 'output/**/*.html'], cb);
});
//  -- cleaning compiled styles --
gulp.task('clean-styles', function (cb) {
  del(['output/static/css'], cb);
});
//  -- cleaning minified javascripts --
gulp.task('clean-js', function (cb) {
  del(['output/static/js'], cb);
});
//  -- cleaning all images --
gulp.task('clean-images', function (cb) {
  del(['output/static/img'], cb);
});
//  -- cleaning all fonts --
gulp.task('clean-fonts', function (cb) {
  del(['output/static/font'], cb);
});


//  -- compiling jade files --
gulp.task('jade2html', function () {
  return gulp
    .src(['template/*.jade', '!template/layout.jade', 'template/**/*.jade'], {path: './'})
    .pipe( jade({ 'pretty': false }) )
      .on('error', function (err) {
        gutil.log('\n === jade error!! ===\n', gutil.colors.red(err));
        this.emit('end');
      })
    .pipe( gulp.dest('output') )
      .on('error', function (err) {
        gutil.log('\n === jade error!! ===\n', gutil.colors.red(err));
        this.emit('end');
      })
    .pipe(connect.reload());
});


//  -- compiling stylus files --
gulp.task('styl2css', function () {
  return gulp
    .src(['template/static/css/*.styl'], {path: './'})
    .pipe( stylus({ use: nib(), compress: true }) )
      .on('error', function (err) {
        gutil.log('\n === stylus error!! ===\n', gutil.colors.cyan(err));
        this.emit('end');
      })
    .pipe( gulp.dest('output/static/css') )
      .on('error', function (err) {
        gutil.log('\n === stylus error!! ===\n', gutil.colors.cyan(err));
        this.emit('end');
      })
    .pipe(connect.reload());
});


//  -- move images --
gulp.task('move-images', function () {
  return gulp
    .src(['template/static/img/**/*'], {path: './'})
    .pipe( gulp.dest('output/static/img') )
      .on('error', function (err) {
        gutil.log('\n === images error!!! ===\n', gutil.colors.green(err));
        this.emit('end');
      })
    .pipe(connect.reload());
});


//  -- move js --
gulp.task('uglify-js', function (cb) {
  return gulp
    .src(['template/static/js/**/*'], {path: './'})
    .pipe( uglify() )
      .on('error', function (err) {
        gutil.log('\n === js error!! ===\n', gutil.colors.yellow(err));
        this.emit('end');
      })
    .pipe( gulp.dest('output/static/js') )
      .on('error', function (err) {
        gutil.log('\n === js error!!! ===\n', gutil.colors.yellow(err));
        this.emit('end');
      })
    .pipe(connect.reload());
});


//  -- move fonts --
gulp.task('move-fonts', function () {
  return gulp
    .src(['template/static/font/**/*'], {path: './'})
    .pipe( gulp.dest('output/static/font') )
      .on('error', function (err) {
        gutil.log('\n === fonts error!!! ===\n', gutil.colors.purple(err));
        this.emit('end');
      })
    .pipe(connect.reload());
});


//  -- server --
gulp.task('serve-files', function () {
  connect.server({
    root: ['output'],
    port: process.env.PORT || 1337,
    host: process.env.HOST || '0.0.0.0' || 'localhost',
    livereload: true
  });
});


//  -- watch file changes --
gulp.task('watch-files', function () {
  gulp.watch(['template/*.jade', '!template/layout.jade', 'template/**/*.jade'], ['jade2html']);
  gulp.watch(['template/static/css/*.styl'], ['styl2css']);
  gulp.watch(['template/static/img/**/*'], ['move-images']);
  gulp.watch(['template/static/js/**/*'], ['uglify-js']);
  gulp.watch(['template/static/font/**/*'], ['move-fonts']);
});


//  -- magic! --
gulp.task('default', ['jade2html', 'styl2css', 'move-images', 'uglify-js', 'move-fonts', 'serve-files', 'watch-files']);


//  -- deploy to gh-pages branch --
/*
  If you haven't yet a gh-pages branch:

  . git checkout --orphan gh-pages
  . git rm -rf .
  . touch README.md
  . git add README.md
  . git commit -m "Setup gh-pages branch"
  . git push --set-upstream origin gh-pages
  . git checkout master
*/
gulp.task('deploy', function () {
  return gulp.src('./output/**/*')
    .pipe(deploy());
});