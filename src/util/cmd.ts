import * as ChildProcess from 'child_process';

export async function cmd(command: string, options?: string[], envVars: {[name: string]: string} = {}) {
  let p = ChildProcess.spawn(command, options, Object.assign({
    cwd: process.cwd()
  }, envVars));
  return new Promise((resolve) => {
    p.stdout.on('data', (x: any) => {
      process.stdout.write(x.toString());
    });
    p.stderr.on('data', (x) => {
      process.stderr.write(x.toString());
    });
    p.on('error', (error) => {
      process.stderr.write(error.toString());
    });
    p.on('exit', (code) => {
      resolve(code);
    });
  });
}