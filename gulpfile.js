var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var pkg = require('./package.json');
var webp = require('gulp-webp');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var uncss = require('gulp-uncss');

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
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('uncss', ['html', 'sass'], function () {
  return gulp.src('dist/css/agency.css')
      .pipe(uncss({
          html: ['dist/index.html'],
      ignore: [
        /.*modal.*/,
        /.*fade.*/,
        /.*shrink.*/
      ]
      }))
      .pipe(gulp.dest('dist/css'));
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
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('html', function() {
  return gulp.src('tpl/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function() {
  return gulp.src('./img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
    .pipe(webp())
    .pipe(gulp.dest('dist/img'))
});


// Default task
gulp.task('default', ['js', 'uncss', 'images']);

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
gulp.task('dev', ['browserSync', 'js', 'uncss', 'images'], function() {
  gulp.watch('scss/*.scss', ['sass']);
  gulp.watch('css/*.css', ['css']);
  gulp.watch('js/*.js', ['js']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('tpl/*.html', ['html', browserSync.reload]);
  gulp.watch('js/**/*.js', browserSync.reload);
});
