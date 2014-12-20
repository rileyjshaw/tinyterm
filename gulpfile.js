var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: false});
var source = require('vinyl-source-stream');
var browserify = require('browserify');

var argv = require('minimist')(process.argv.slice(2));

var paths = {
  dist: './dist',
  scripts: {
    entry: './app/js/main.js',
    all: './app/js/**/*.js'
  },
  staticDir: './web/static',
  stylesheets: './app/stylesheets/**/*.sass',
  webDist: './web_dist',
  webStatic: './web/static/**/*',
  webStylesheets: './web/stylesheets/**/*.sass'
};

gulp.task('lint', function () {
  return gulp.src(paths.scripts.all)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('scripts', ['lint'], function () {
  return browserify(paths.scripts.entry, { standalone: 'TinyTerm' })
    .bundle()
    .pipe(source('tinyterm.js'))
    .pipe(gulp.dest(paths.staticDir))
    .pipe(gulp.dest(paths.dist))
    .pipe($.rename('tinyterm.min.js'))
    .pipe($.streamify( $.uglify() ))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('sass', function () {
  return gulp.src(paths.stylesheets)
    .pipe($.rubySass({ "sourcemap=none": true }))
    .pipe($.autoprefixer())
    .pipe(gulp.dest(paths.dist))
    .pipe(gulp.dest(paths.staticDir))
    .pipe($.minifyCss())
    .pipe($.rename(function (path) {
      path.basename += ".min";
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('sassWeb', function () {
  return gulp.src(paths.webStylesheets)
    .pipe($.rubySass({ "sourcemap=none": true }))
    .pipe($.autoprefixer())
    .pipe(gulp.dest(paths.staticDir))
});

gulp.task('buildWeb', function () {
  return gulp.src(paths.webStatic)
    .pipe(gulp.dest(paths.webDist));
});

gulp.task('watch', function () {
  gulp.watch([paths.scripts.all], ['scripts']);
  gulp.watch([paths.stylesheets], ['sass']);
});

gulp.task('watchWeb', function () {
  gulp.watch([paths.scripts.all], ['scripts']);
  gulp.watch([paths.stylesheets], ['sass']);
  gulp.watch([paths.webStylesheets], ['sassWeb']);
  gulp.watch([paths.webStatic], ['buildWeb']);
});

gulp.task('webserver', function () {
  gulp.src(paths.webDist)
    .pipe($.webserver({
      host: '0.0.0.0',
      livereload: true,
      open: true
    }));
});

gulp.task( 'default', [ 'lint', 'scripts', 'watch' ] );
gulp.task( 'web', [ 'sass', 'buildWeb', 'webserver', 'watchWeb' ] );
gulp.task('deploy', ['buildWeb'], function () {
  gulp.src(paths.webDist + '/**/*')
    .pipe($.ghPages('https://github.com/rileyjshaw/tinyterm.git', 'origin'));
});
