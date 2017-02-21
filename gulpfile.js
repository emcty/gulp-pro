var gulp=require("gulp");
var jshint=require("gulp-jshint");


gulp.task("jstest",function(){ 
	gulp.src('./assets/js/**/*.js')
	    .pipe(jshint())
	    .pipe(jshint.reporter('default'));
});


gulp.task('default', ['jstest']);