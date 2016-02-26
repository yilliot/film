"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('default', ['static', 'scripts', 'styles']);

gulp.task('watch', function(cb) {

  watch('assets/**/*', function(){
    gulp.start('default').on('end', cb);
  });

});

gulp.task('static', function() {

  gulp.src('node_modules/semantic-ui/dist/themes/**/*').pipe(gulp.dest('dist/styles/themes'));

  gulp.src('assets/manifest.json').pipe(gulp.dest('dist'));
  gulp.src('assets/html/*').pipe(gulp.dest('dist/html'));
});

gulp.task('scripts', function() {

// single
  gulp.src([
    'assets/scripts/app.js',
    'assets/scripts/control.js',
    'assets/scripts/present.js',
    'assets/scripts/background.js'
  ]).pipe(gulp.dest('dist/scripts'));

// dependancies
  gulp.src([
      'node_modules/jquery/dist/jquery.js',
      'node_modules/semantic-ui/dist/semantic.js',
      'node_modules/vue/dist/vue.js'
    ])
    .pipe(concat('dependancies.js'))
    .pipe(gulp.dest('dist/scripts'));

});


gulp.task('styles', function(){

  return gulp.src([
      'assets/styles/*',
      'node_modules/semantic-ui/dist/semantic.css',
      'node_modules/semantic-ui/dist/components/reset.css'
    ])
    .pipe(sass())
    .pipe(gulp.dest('dist/styles'));
});


gulp.task('browserify', function(){

  return browserify('assets/scripts/app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist/scripts'));

});