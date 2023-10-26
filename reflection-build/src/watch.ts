import * as gulp from 'gulp';
import { exec } from 'child_process';
import * as path from 'path';

// Utility function to execute shell commands
function executeCommand(command: string, cb: (error?: any) => void): void {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err.message);
    }
    if (stderr) {
      console.error(stderr);
    }
    if (stdout) {
      console.log(stdout);
    }
    
    cb();  // Always call the callback to signal task completion
  });
}

// Task to run the reflection-build script
gulp.task('reflection-build', (cb) => {
  const command = `node ${path.resolve(__dirname, './runBuild.js')}`;
  executeCommand(command, cb);
});

// Task to run the TypeScript compiler
gulp.task('tsc', (cb) => {
  const command = 'tsc --project ' + path.resolve(process.cwd(), 'tsconfig.json');
  executeCommand(command, cb);
});

gulp.task('watch', () => {
  const watcher = gulp.watch(
    [path.resolve(process.cwd(), 'src/**/*'), path.resolve(process.cwd(), 'test/**/*'), path.resolve(process.cwd(), 'index.ts')],
    gulp.series('reflection-build', 'tsc')
  );

  watcher.on('error', function(this: typeof watcher, err: any) {
    console.error('Error:', err.toString());
    this.emit('end');  // End the task to allow the watch task to continue
  });
});

gulp.task('default', gulp.series('reflection-build', 'tsc', 'watch'));  // run reflection-build and tsc once at the start
