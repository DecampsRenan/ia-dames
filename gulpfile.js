const gulp = require('gulp');
const ts = require('gulp-typescript');

const tsConfigFile = ts.createProject('tsconfig.json');

gulp.task('typescript:compile', () => {
  return tsConfigFile.src()
    .pipe(tsConfigFile()).js
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['typescript:compile'], () => {
  gulp.watch('src/**/*.ts', ['typescript:compile']);
});

gulp.task('default', ['watch']);
