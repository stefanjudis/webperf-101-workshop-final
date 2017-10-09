var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var pkg = require('./package.json');
var webp = require('gulp-webp');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  ''
].join('');

gulp.task('sass', function() {
  return gulp.src('scss/agency.scss')
    .pipe(sass())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('css', ['sass'], function() {
  return gulp.src('dist/css/agency.css')
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('vendor-js', function() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/popper.js/dist/umd/popper.min.js',
    'node_modules/jquery.easing/jquery.easing.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js'
  ])
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('dist/vendor'));
});

gulp.task('js', ['vendor-js'], function() {
  return gulp.src('js/*.js')
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('html', function() {
  return gulp.src('tpl/index.html')
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function() {
  return gulp.src('./img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
    .pipe(webp())
    .pipe(gulp.dest('dist/img'))
});

// Copy vendor files from /node_modules into /vendor
// NOTE: requires `npm install` before running!
gulp.task('copy', function() {
  gulp.src([
      'node_modules/bootstrap/dist/**/*',
      '!**/npm.js',
      '!**/bootstrap-theme.*',
      '!**/*.map'
    ])
    .pipe(gulp.dest('dist/vendor/bootstrap'))

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('dist/vendor/jquery'))

  gulp.src(['node_modules/popper.js/dist/umd/popper.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
    .pipe(gulp.dest('dist/vendor/popper'))

  gulp.src(['node_modules/jquery.easing/*.js'])
    .pipe(gulp.dest('dist/vendor/jquery-easing'))

  gulp.src([
      'node_modules/font-awesome/**',
      '!node_modules/font-awesome/**/*.map',
      '!node_modules/font-awesome/.npmignore',
      '!node_modules/font-awesome/*.txt',
      '!node_modules/font-awesome/*.md',
      '!node_modules/font-awesome/*.json'
    ])
    .pipe(gulp.dest('dist/vendor/font-awesome'))
})

// Default task
gulp.task('default', ['html', 'sass', 'css', 'js', 'images', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    startPath: "/dist",
    server: {
      baseDir: '.'
    },
  })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'copy', 'sass', 'css', 'js', 'html', 'images'], function() {
  gulp.watch('scss/*.scss', ['sass']);
  gulp.watch('css/*.css', ['css']);
  gulp.watch('js/*.js', ['js']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('*.html', ['html', browserSync.reload]);
  gulp.watch('js/**/*.js', browserSync.reload);
});
