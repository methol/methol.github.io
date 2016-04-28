/*
 * 用于压缩合并静态资源文件，同时生成指定的代码至release文件夹
 * http://www.gulpjs.com.cn/docs/
 */

'use strict';

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    htmlmin = require('gulp-htmlmin');

gulp.task('default', ['clean'], function () {
  gulp.start('css', 'js', 'img', 'html', 'copy');
});

// css压缩
gulp.task('css', function () {
  return gulp.src('public/**/*.css')
      // .pipe(sass({ style: 'expanded' }))  // 可以编译编译less或sass样式文件
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6',
          'android 4'))
      //       .pipe(gulp.dest('dist'))
      //       .pipe(rename({suffix: '.min'}))
      .pipe(minifycss())
//       .pipe(notify({message: 'Styles task complete'}))
      .pipe(gulp.dest('dist'));
});

// 脚本压缩
gulp.task('js', function () {
  return gulp.src('public/**/*.js')
      //.pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'))
      //         .pipe(concat('main.js'))
      //       .pipe(gulp.dest('dist'))
      //       .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
//       .pipe(notify({message: 'Scripts task complete'}))
      .pipe(gulp.dest('dist'));
});

// 图片压缩
gulp.task('img', function () {
  return gulp.src(['public/**/*.png', 'public/**/*.jpg', 'public/**/*.gif'])
      .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
//       .pipe(notify({message: 'Images task complete'}))
      .pipe(gulp.dest('dist'));
});

// 重新引用静态文件 并压缩
gulp.task('html', function () {
  return gulp.src('public/**/*.html')
      .pipe(useref())
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', minifycss()))
      .pipe(gulp.dest('dist'));
});

// 移动其他文件
gulp.task('copy', function () {
  return gulp.src(['public/**/*','!public/**/*.css', '!public/**/*.js', '!public/**/*.png', '!public/**/*.jpg',
        '!public/**/*.gif', '!public/**/*.html'])
//       .pipe(notify({message: 'copy task complete'}))
      .pipe(gulp.dest('dist'));

});


// 清理文件
gulp.task('clean', function () {
  return gulp.src(['dist'], {read: false}).pipe(clean());
});

// 看守线程
gulp.task('watch', function () {
  gulp.watch('public/**/*.css', ['css']);// 看守所有.css档
  gulp.watch('public/**/*.js', ['js']);// 看守所有.js档
  gulp.watch('public/**/*.png', 'public/**/*.jpg', 'public/**/*.gif', ['img']);// 看守所有图片档
  // 建立即时重整服务
  var server = livereload();
  // 看守所有位在 release/  目录下的档案，一旦有更动，便进行重整
  gulp.watch(['dist/**']).on('change', function (file) {
    server.changed(file.path);
  });
});