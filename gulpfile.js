/**
 * Created by zjy on 16-3-13.
 */
var gulp = require("gulp"),
    less = require("gulp-less"),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    cssMinify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;


var path = {
    less:['src/less/*.less','src/less/*.css'],
    js: ['src/js/zepto.js','src/js/mustache.min.js','src/js/js.js'],
    html : '*.html'
};

gulp.task('default', function(){
    browserSync({
        server: {
            baseDir: './'
        }
    });
    gulp.watch(path.less[0],['less']);
    gulp.watch(path.js,['js']);
    gulp.watch(path.html,['html']);
});

gulp.task('less', function () {
    gulp.src(path.less)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('sdk-wechat.min.css'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(reload({ stream:true }));
});


gulp.task('js', function () {
    gulp.src(path.js)
        .pipe(concat('sdk-wechat.min.js'))
        .pipe(gulp.dest('dist/js/'))
        .pipe(reload({ stream:true }));
});

gulp.task('html', function () {
    gulp.src(path.html)
        .pipe(reload({ stream:true }));
});
//var spriter = require("gulp-spriter");
//gulp.task("spriter",function(){
//    return gulp.src("./src/less/icon.less")
//        .pipe(less())
//        .pipe(spriter({
//            sprite:"test.png",
//            slice:"./src/slice",
//            outpath:"./build/tests"
//        }))
//        .pipe(gulp.dest('./src/less'))
//})
