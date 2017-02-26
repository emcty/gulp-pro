var gulp=require("gulp");


var uglify = require('gulp-uglify');  //加载js压缩
gulp.task('jsCompress', function () {
    gulp.src(['./assets/js/**/*.js','!./assets/js/abc/exclude.js'])  //获取文件，同时过滤掉.min.js文件
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));  //输出文件
});


var jshint=require("gulp-jshint");
gulp.task("jsHint",function(){ 
	gulp.src('./assets/js/**/*.js')
	    .pipe(jshint())
	    .pipe(jshint.reporter('default'));
});


var cssMin = require('gulp-css'); 
gulp.task('cssMinfy', function(){
  return gulp.src('./assets/css/**/*.css')
    .pipe(cssMin())
    .pipe(gulp.dest('dist/css/'));
});


var imagemin = require('gulp-imagemin');
gulp.task('imageMin', function () {
    return gulp.src('./assets/images/*')
        .pipe(imagemin(
			{
	            progressive: true,
	            optimizationLevel:3
        	}
        ))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('default', ['jsHint','jsCompress','cssMinfy','imageMin']);


