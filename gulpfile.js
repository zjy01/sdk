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
    less: ['src/less/*.less', 'src/less/*.css'],
    js1: ['src/js/zepto.js', 'src/js/mustache.min.js', 'src/js/js.js'],
    js: ['src/js/zepto.js', 'src/js/mustache.min.js', 'src/js/index.js'],
    html: '*.html'
};

gulp.task('default', function () {
    //browserSync({
    //    server: {
    //        baseDir: './'
    //    }
    //});
    gulp.watch(path.less[0], ['less']);
    gulp.watch(path.js, ['js']);
    gulp.watch(path.js1, ['js1']);
    gulp.watch(path.html, ['html']);
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
        .pipe(reload({stream: true}));
});


gulp.task('js1', function () {
    gulp.src(path.js1)
        .pipe(concat('sdk-wechat.min.js'))
        .pipe(gulp.dest('dist/js/'))
        .pipe(reload({stream: true}));
});

gulp.task('js', function () {
    gulp.src(path.js)
        .pipe(concat('sdk-wechat-index.min.js'))
        .pipe(gulp.dest('dist/js/'))
        .pipe(reload({stream: true}));
});

gulp.task('html', function () {
    gulp.src(path.html)
        .pipe(reload({stream: true}));
});
//var spriter = require("gulp-spriter");
var spriter = require('gulp-css-spriter');
gulp.task("spriter", function () {
    var timestamp = +new Date();
    return gulp.src("./src/less/icon.less")
        .pipe(less())
        .pipe(spriter({
            // 生成的spriter的位置
            'spriteSheet': './dist/img/sprite' + timestamp + '.png',
            // 生成样式文件图片引用地址的路径
            // 如下将生产：backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': '../img/sprite' + timestamp + '.png'
        }))
        .pipe(gulp.dest('./src/less'))
})


gulp.task('test', function () {
    gulp.src('test/less.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./test/'))
});

gulp.task('minify-css', function () {
   gulp.src('dist/css/*.css')
    .pipe(cssMinify())
    .pipe(gulp.dest("dist/css/"))
});
gulp.task('uglify-js', function () {
   gulp.src('dist/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/"))
});
