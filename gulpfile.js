/*jshint node:true, eqnull:true, laxcomma:true, undef:true, indent:2, camelcase:false, unused:true */
'use strict';

//  -- packages required --
var gulp = require('gulp');

var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var nib = require('nib');
var uglify = require('gulp-uglify');

var del = require('del');
var connect = require('gulp-connect');

var watch = require('gulp-watch');
var gutil = require('gulp-util');
var deploy = require('gulp-gh-pages');


//  -- cleaning all items in output --
gulp.task('clean', function (cb) {
  del.sync([__dirname + '/output/'], cb);
});


//  -- serve files --
gulp.task('serve', function () {
  connect.server({
    root: __dirname + '/output/',
    livereload: true
  });
});


//  -- compile templates --
gulp.task('templates', function () { 
  gulp
    .src([
      '!' + __dirname + '/template/layout.jade', 
      __dirname + '/template/*.jade', 
      __dirname + '/template/**/*.jade'
    ])
    .pipe(
      watch([
        __dirname + '/template/*.jade',
        __dirname + '/template/**/*.jade'
      ])
    )
    .pipe(jade({
      pretty: false
    }))
    .on('error', function (err) {
      gutil.log('\n === jade error!! ===\n', gutil.colors.red(err));
      this.emit('end');
    })
    .pipe(
      gulp.dest(__dirname + '/output/')
    )
    .pipe(
      connect.reload()
    );
});


//  -- compile styles --
gulp.task('styles', function () {
  gulp
    .src([
      __dirname + '/template/static/css/*.styl'
    ])
    .pipe(
      watch(__dirname + '/template/static/css/*.styl')
    )
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
      gulp.dest(__dirname + '/output/static/css')
    )
    .pipe(
      connect.reload()
    );
});


//  -- move js --
gulp.task('javascripts', function () {
  gulp
    .src([
      __dirname + '/template/static/js/**/*'
    ])
    .pipe(
      watch(__dirname + '/template/static/js/**/*')
    )
    .pipe(
      uglify()
    )
      .on('error', function (err) {
        gutil.log('\n === js error!! ===\n', gutil.colors.yellow(err));
        this.emit('end');
      })
    .pipe( 
      gulp.dest(__dirname + '/output/static/js')
    )
    .pipe(
      connect.reload()
    );
});


//  -- move fonts --
gulp.task('fonts', function () {
  gulp
    .src([
      __dirname + '/template/static/font/**/*'
    ])
    .pipe(
      watch(__dirname + '/template/static/font/**/*')
    )
    .pipe(
      gulp.dest(__dirname + '/output/static/font')
    )
      .on('error', function (err) {
        gutil.log('\n === fonts error!!! ===\n', gutil.colors.purple(err));
        this.emit('end');
      })
    .pipe(
      connect.reload()
    );
});


//  -- move images --
gulp.task('images', function () {
  gulp
    .src([
      __dirname + '/template/static/img/**/*'
    ])
    .pipe(
      watch(__dirname + '/template/static/img/**/*')
    )
    .pipe(
      gulp.dest(__dirname + '/output/static/img')
    )
      .on('error', function (err) {
        gutil.log('\n === images error!!! ===\n', gutil.colors.green(err));
        this.emit('end');
      })
    .pipe(
      connect.reload()
    );
});


gulp.task('default', ['clean', 'templates', 'styles', 'javascripts', 'images', 'fonts', 'serve']);




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
  gulp
    .src(
      __dirname + '/output/**/*'
    )
    .pipe(
      deploy()
    );
});