const browserSync = require('browser-sync').create();
const del = require('del');
const fs = require("fs");
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const gzipSize = require('gzip-size');
const through = require('through2');
const path = require('path');
const glob = require ('fast-glob');
const rename = require('gulp-rename');
const chalk = require('chalk');
const jam = require('./jam');

function clean(cb) {
  return del(['dist/']);
  cb();
}

function browserSyncInit(cb) {
  browserSync.init({
    serveStatic: ['dist'],
    serveStaticOptions: {
      extensions: ['html']
    },
    logSnippet: false
  });
  cb();
}

function reload(cb) {
  browserSync.reload();
  cb();
}

function watch() {
  gulp.watch('assets/css/*.css', css);

  gulp.watch('assets/img/*', img);

  gulp.watch('src/**/*.{html,md}', gulp.series(html, reload))
      .on('all', (event, path, stats) => {
        console.log('Markup changed:', path);
      });
}

function css() {
  let init = mini = gzip = 0;
  return gulp
    .src('assets/css/*.css')
    .pipe(concat('styles.css'))
    .pipe(cleanCSS({debug: true}, (details) => {
      init = details.stats.originalSize;
      mini = details.stats.minifiedSize;
    }))
    .pipe(gulp.dest('dist'))
    .on('end', () => {
      gzip = gzipSize.fileSync('dist/styles.css');
      console.log(`Minified CSS from ${init}B to ${mini}B (${gzip}B gzipped)`);
    })
    .pipe(browserSync.stream())
}

function img() {
  return gulp
    .src('assets/img/**/*')
    .pipe(gulp.dest('dist/img'));
}

function js() {
  return gulp
    .src('assets/js/**/*.js')
    .pipe(gulp.dest('dist/js'));
}


function html() {
  function getFiles(pattern) {
    const filepaths = glob.sync(pattern);
    const files = {};

    function remove_(string) {
      return string.replace(/^_/, '').replace(/\/_/, '/');
    }

    filepaths.forEach(filepath => {
      // Put file contents into files obj, without optional underscores in key
      files[remove_(filepath)] = fs.readFileSync(filepath, 'utf8');
    });

    return files;
  }

  const patterns = {
    templates: 'src/*/?(_)template.html',
    listings: 'src/*/?(_)listing.html',
    parts: 'src/parts/*.html',
    notIndexes: 'src/**/!(?(_)index).{html,md}',
    indexes: 'src/**/?(_)index.{html,md}'
  };

  const files = {
    templates: getFiles(patterns.templates),
    listings: getFiles(patterns.listings),
    parts: getFiles(patterns.parts)
  };

  return gulp
    .src([
      patterns.notIndexes,
      patterns.indexes,
      `!${patterns.templates}`,
      `!${patterns.listings}`,
      `!${patterns.parts}`,
    ])
    .pipe(through.obj((chunk, enc, cb) => jam(chunk, enc, cb, files)))
    .pipe(rename(path => ({
      // Move pages out of their subdirectory, to the root of /dist
      dirname: path.dirname === 'pages' ? '' : path.dirname,
      // Remove optional underscores so e.g. '_index.html' becomes 'index.html'
      basename: path.basename.replace(/^_/, ''),
      // All extension names are now .html (i.e. convert from .md)
      extname: '.html'
    })))
    .pipe(gulp.dest('./dist'))
}

exports.clean = clean;

exports.watch = gulp.parallel(
  html,
  css,
  js,
  img,
  gulp.series(
    browserSyncInit,
    watch
  )
);

exports.default = gulp.series(
  clean,
  gulp.parallel(
    html,
    css,
    img,
    js
  )
);
