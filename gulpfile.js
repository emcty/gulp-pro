let  gulp=require("gulp");
let uglify = require('gulp-uglify');  //加载js压缩
let babel=require("gulp-babel");
let jshint=require("gulp-jshint");
let cssMin = require('gulp-css'); 
let imagemin = require('gulp-imagemin');
let runSequence=require("run-sequence");
let del=require("del");
gulp.task("clean",function(){ 
    del(['dist'])
});
gulp.task('jsCompress', function () {
    gulp.src(['./assets/js/**/*.js','!./assets/js/abc/exclude.js'])  //获取文件，同时过滤掉.min.js文件
         .pipe(babel())
         .pipe(uglify())
         .pipe(gulp.dest('dist/js/')); //输出文件
});

gulp.task("jsHint",function(){ 
    gulp.src('./assets/js/**/*.js')
     .pipe(jshint({
            esversion: 6
        }))
    .pipe(jshint.reporter('default'))
 });

gulp.task('cssMinfy', function(){
  return gulp.src('./assets/css/**/*.css')
    .pipe(cssMin())
    .pipe(gulp.dest('dist/css/'));
});

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
gulp.task('build',function(done){ 
    runSequence(
        'clean',
        ['jsCompress', 'cssMinfy', 'imageMin'],
        done
    )
})


gulp.task('default', ['build']);


