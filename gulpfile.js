// Include gulp
var gulp = require('gulp'); 
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var clean = require('gulp-clean');
var karma = require('gulp-karma');

var testFiles = [
  './app/bower_components/angular/angular.js',
  './app/bower_components/angular-route/angular-route.js',
  './app/bower_components/angular-animate/angular-animate.js',
  './app/bower_components/angular-mocks/angular-mocks.js',
  './app/bower_components/firebase/firebase.js',
  './app/bower_components/angularfire/dist/angularfire.js',
  './app/bower_components/jquery/dist/*.js',
  './node_modules/jasmine-jquery/lib/*.js',
  './app/*.js',
  './app/home/*.js',
  './app/noteDecks/*.js',
  './app/noteDecks/noteCards/*.js',
  './app/noteCard/*.js',
  './app/noteCard/*.html',
  './app/noteDeck/*.js',
  './app/noteDeck/*.html',
  './test/*.js'
];

gulp.task('test', function() {
  // Be sure to return the stream
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('autotest', function() {
  // Be sure to return the stream
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }))
});

gulp.task('copy-html-files', function() {
  gulp.src(['./app/**/*.html', '!./app/index.html'], {base: './app'})
    .pipe(gulp.dest('build/'));
});

gulp.task('usemin', function() {
  gulp.src('./app/index.html')
    .pipe(usemin({
      css: [minifyCss(), 'concat', rev()],
      js: [uglify(), rev()]
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('connect', function() {
  connect.server({
    root: 'app/'
  });
});

// Default Task
gulp.task('default', ['connect']);
gulp.task('build', ['copy-html-files', 'usemin']);
