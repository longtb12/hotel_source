/// <binding AfterBuild='build-all' />

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    clean = require("gulp-clean");

var root_path = {
    webroot: "./wwwroot/"
};

gulp.task('build-controller-js', function () {
    return gulp.src([
        './wwwroot/app/**/*.controller.js',
        './wwwroot/app/**/*.directive.js'
    ])
        .pipe(concat('app.controller.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(root_path.webroot));
});

gulp.task('build-module-js', function () {
    return gulp.src(['./wwwroot/app/**/*.module.js'])
        .pipe(concat('app.module.js'))
        .pipe(uglify())
        .pipe(gulp.dest(root_path.webroot));
});

gulp.task('build-route-js', function () {
    return gulp.src(['./wwwroot/app/**/*.route.js'])
        .pipe(concat('app.route.js'))
        .pipe(uglify())
        .pipe(gulp.dest(root_path.webroot));
});

gulp.task('clean-html', function () {
    return gulp.src(root_path.webroot + 'views')
        .pipe(clean());
});

gulp.task('copy-constants', function () {
    return gulp.src(['./wwwroot/app/index.constants.js'])
        .pipe(uglify())
        .pipe(rename('app.constants.js'))
        .pipe(gulp.dest(root_path.webroot));
});

gulp.task('copy-config', function () {
    return gulp.src(['./wwwroot/app/index.config.js'])
        .pipe(uglify())
        .pipe(rename('app.config.js'))
        .pipe(gulp.dest(root_path.webroot));
});

gulp.task('copy-run', function () {
    return gulp.src(['./wwwroot/app/index.run.js'])
        .pipe(uglify())
        .pipe(rename('app.run.js'))
        .pipe(gulp.dest(root_path.webroot));
});

gulp.task('copy-service', function () {
    return gulp.src(['./wwwroot/app/index.service.js'])
        .pipe(uglify())
        .pipe(rename('app.service.js'))
        .pipe(gulp.dest(root_path.webroot));
});

gulp.task('copy-html', function () {
    return gulp.src('wwwroot/app/**/*.html')
        .pipe(gulp.dest(root_path.webroot + 'views'));
});

gulp.task("copy-all", gulp.series('copy-constants', 'copy-config', 'copy-run', 'copy-service', 'copy-html'));
gulp.task("build-all", gulp.series('build-module-js', 'build-route-js', 'build-controller-js'));

//gulp.task("build", gulp.series('clean-html', 'build-all', 'copy-all'));
gulp.task("build", gulp.series('build-all', 'copy-all'));
//Build Endlogin