'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

// compile sass
gulp.task('compileSass', () => {
  return gulp.src('src/scss/app.scss')
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    // name for css file
    .pipe(concat('app.css'))
    .pipe(maps.write('.'))
    // write to this directory
    .pipe(gulp.dest('dist/css'));
});

// Concatinate JS
gulp.task('concatJs', () => {
  return gulp.src([
    // libs eg.
    // 'node_modules/jQuery/dist/jquery.js',
    // My js
    'src/js/store.js',
    'src/js/helpers.js',
    'src/js/animate.js',
    'src/js/functions.js',
    'src/js/load.js'
  ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'))
});

// reload
gulp.task('reload', (done) => {
  browserSync.reload();
  done();  
});

// compile sass and reload
gulp.task('sassReload', ['compileSass'], (done) => {
  browserSync.reload();
  done();
})

// compile js and reload
gulp.task('jsReload', ['concatJs'], (done) => {
  browserSync.reload();
  done();
})

// watch task
gulp.task('watchFiles', () => {
  gulp.watch(['src/scss/**/*.scss'], ['sassReload']); // watch sass
  gulp.watch(['src/js/*.js'], ['jsReload']); // watch js
  gulp.watch(['dist/*.html'], ['reload']); // watch html
})

// start browser-sync server
gulp.task('browserSync', () => {
  browserSync.init({
    server: "./dist",    
    browser: "chrome",
    notify: false
  });
})

// default task
gulp.task('default', ['compileSass', 'concatJs'], (done) => {
  gulp.start('watchFiles');
  gulp.start('browserSync');
});