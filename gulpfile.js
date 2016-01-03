var source = require('vinyl-source-stream');
var gulp = require('gulp');
var tap = require('gulp-tap');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var watchify = require('watchify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

var sources = ['./src/main.js'];
var destination = './build';
var onError = function(error) {
  gutil.log(gutil.colors.red(error.message));
};

var standalone = 'Supaplex';

gulp.task('lint', function() {
  return gulp.src('./src/main.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('prod', function() {
  return browserify('./src/main.js', {
    standalone: standalone
  }).bundle()
    .on('error', onError)
    .pipe(source('supaplex.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(destination));
});

gulp.task('levels', function() {
  var buildLevels = require('./build-levels');
  return gulp.src('./assets/data/levels.dat')
    .pipe(tap(function(file) {
      var contents = buildLevels(file.contents);
      file.contents = new Buffer(JSON.stringify(contents));
      file.path = gutil.replaceExtension(file.path, '.json');
    }))
    .pipe(gulp.dest(destination));
});

gulp.task('dev', ['levels'], function() {
  var opts = watchify.args;
  opts.debug = true;
  opts.standalone = standalone;
  var bundleStream = watchify(browserify(sources, opts))
    .transform('babelify',
               { presets: ["es2015"],
                 plugins: ['add-module-exports'] })
    .on('update', rebundle)
    .on('log', gutil.log);

  function rebundle() {
    return bundleStream.bundle()
      .on('error', onError)
      .pipe(source('supaplex.js'))
      .pipe(gulp.dest(destination));
  }

  return rebundle();
});

gulp.task('default', ['dev']);
