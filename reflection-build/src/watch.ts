import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as shell from 'gulp-shell';
import * as path from 'path';

// Function to get the TypeScript project configuration from the consuming package
function getTsProject() {
  const tsConfigPath = path.resolve(process.cwd(), 'tsconfig.json');
  return ts.createProject(tsConfigPath);
}

gulp.task('reflection-build', shell.task([
  `node ${path.resolve(__dirname, './runBuild.js')}`
]));

gulp.task('compile', () => {
  const tsProject = getTsProject();
  return tsProject.src()
    .pipe(tsProject())
    .on('error', (error) => {
      console.error(error.toString());
    })
    .js.pipe(gulp.dest(path.resolve(process.cwd(), 'dist')));
});

gulp.task('watch', () => {
  gulp.watch([path.resolve(process.cwd(), 'src/**/*.ts'), path.resolve(process.cwd(), 'index.ts')], gulp.series('reflection-build', 'compile'));
});

gulp.task('default', gulp.series('reflection-build', 'compile', 'watch'));  // run reflection-build and compile once at the start
