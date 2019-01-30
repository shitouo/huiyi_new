/**
 * Created by zhphu on 2017/02/21.
 */
/*项目静态资源打包文件*/

var config = require('./config_default').config;
var src = config.path.gulp.build;
var dist = config.path.gulp.dist;//打包后最终文件存放目录
var temporary = dist.replace('dist', 'temporary');//临时存放目录

var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    RevAll = require('gulp-rev-all'),//加md5版本号
    revReplace = require('gulp-rev-replace'),
    replace = require('gulp-replace'),
    clean = require('gulp-rimraf');


// Less解析
gulp.task('build-less', function () {
    gulp.src("./public" + src + '/less/**')
        .pipe(less())
        .pipe(gulp.dest("./public" + src + '/css'))
       .pipe(autoprefixer({browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],cascade:true}))
        .pipe(replace('/public/build/',config.path.baseUrl+"/"))
        .pipe(cleancss())
        .pipe(gulp.dest("./public" + temporary + '/css'));
});

//迁移字体文件
gulp.task("move-fonts", function () {
    gulp.src("./public" + src + '/fonts/**')
        .pipe(gulp.dest("./public" + temporary + '/fonts'));
});

// js脚本
gulp.task('build-js', function () {
    if (config.env === 'prod') {
        return gulp.src("./public" + src + '/js/**')
            .pipe(uglify())
            .pipe(gulp.dest("./public" + temporary + '/js'));
    }
    return gulp.src("./public" + src + '/js/**')
        .pipe(gulp.dest("./public" + temporary + '/js'));
});

// 图片
gulp.task('build-img', function () {
    return gulp.src('./public/' + src + '/img/**')
        .pipe(gulp.dest('./public/' + temporary + '/img'));
});

// 给所有build文件加md5戳
gulp.task("revAll", ['build-less','move-fonts', 'build-js', 'build-img'], function () {
    return gulp.src(["./public" + temporary + '/js/**', "./public" + temporary + '/css/**', "./public" + temporary + '/img/**'])
        .pipe(RevAll.revision({hashLength: 20,includeFilesInManifest:['.js','.css','.png','.gif']}))
        .pipe(gulp.dest("./public" + temporary))
        .pipe(RevAll.manifestFile())
        .pipe(gulp.dest("./public" + temporary));
});

// 替换静态资源的url
gulp.task("resource-replace", ["revAll"], function () {
    var manifest = gulp.src("./public" + temporary + "/rev-manifest.json");
    return gulp.src("./public" + temporary + "/**")
        .pipe(revReplace({manifest: manifest, replaceInExtensions: '.css,.js'}))
        .pipe(gulp.dest("./public" + temporary));
});


// 替换模版中的静态资源url地址
gulp.task("ejs-replace", ["revAll"], function () {
    var manifest = gulp.src("./public/" + temporary + "/rev-manifest.json");
    return gulp.src("views/" + src + "/**")
        .pipe(revReplace({manifest: manifest, replaceInExtensions: '.ejs'}))
        .pipe(gulp.dest("views/" + temporary));
});

// 清理临时资源存放区
gulp.task('clean-temporary', function () {
    return gulp.src(['public/' + temporary, 'views/' + temporary], {read: false}).pipe(clean());
});

// 清理资源真实存放区
gulp.task('clean-dist', ['ejs-replace', 'resource-replace'], function () {
    return gulp.src(['public/' + dist, 'views/' + dist], {read: false}).pipe(clean());
});

// 将临时存放区的静态资源移动到真实资源存放区
gulp.task('resource-move', ['clean-dist'], function () {
    return gulp.src('public/' + temporary + '/**')
        .pipe(gulp.dest('public/' + dist + '/'));
});

// 将临时存放区的ejs移动到真实资源存放区
gulp.task('ejs-move', ['clean-dist'], function () {
    return gulp.src('views/' + temporary + '/**')
        .pipe(gulp.dest('views/' + dist + '/'));
});

// 任务开始入口
gulp.task('default',['clean-temporary'], function () {
    gulp.start('resource-move', 'ejs-move');
});



