"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');


gulp.task('static', function() {
  gulp.src('assets/manifest.json').pipe(gulp.dest('dist'));
  gulp.src('assets/html/*').pipe(gulp.dest('dist/html'));
});

gulp.task('scripts', function() {

// single
  gulp.src([
    'assets/scripts/control.js',
    'assets/scripts/present.js',
    'assets/scripts/background.js'
  ]).pipe(gulp.dest('dist/scripts'));

// dependancies
  gulp.src('node_modules/jquery/dist/jquery.js')
    .pipe(concat('dependancies.js'))
    .pipe(gulp.dest('dist/scripts'));

  // gulp.src([
  //   'node_modules/vue/dist/vue.js',
  // ])
  // .pipe(concat('dependancies.js'))
  // .pipe(gulp.dest('dist/scripts'));

  // gulp.src([
  //   'assets/scripts/*',
  // ])
  // .pipe(concat('app.js'))
  // .pipe(gulp.dest('dist/scripts'));


});


gulp.task('styles', function(){

  return gulp.src('assets/styles/*')
    .pipe(sass())
    .pipe(gulp.dest('dist/styles'));
});


gulp.task('browserify', function(){

  return browserify('assets/scripts/app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist/scripts'));

});