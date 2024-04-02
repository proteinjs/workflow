import * as path from 'path'
const graphlib = require('@dagrejs/graphlib')
import { PackageUtil, cmd } from '@brentbahry/util-server'
import { Logger } from '@brentbahry/util'

export const watchRepo = async () => {
  const logger = new Logger('watchRepo');
  const repoPath = path.resolve(__dirname, '../../..'); // __dirname: build/dist
  const localPackageMap = await PackageUtil.getLocalPackageMap(repoPath, ['**/reflection-build/test/**']);
  const packageDependencyGraph = await PackageUtil.getPackageDependencyGraph(Object.values(localPackageMap).map(localPackage => localPackage.packageJson));
  const sortedLocalPackageNames = (graphlib.alg.topsort(packageDependencyGraph).reverse() as string[]).filter(packageName => !!localPackageMap[packageName]);

  logger.info(`> Watching ${sortedLocalPackageNames.length} packages in the proteinjs workspace (${repoPath})`);
  const loggingStartDelay = 0;
  for (let packageName of sortedLocalPackageNames) {
    const localPackage = localPackageMap[packageName];
    if (!localPackage.packageJson.scripts?.watch)
      continue;

    const packageDir = path.dirname(localPackage.filePath);
    const loggingEnabledState = { loggingEnabled: false };
    setTimeout(() => loggingEnabledState.loggingEnabled = true, loggingStartDelay);
    const logPrefix = `[${packageName}] `;
    let inMultiLineLog = false;
    const stdoutFilter = (log: string) => {
      if (log.includes('File change detected. Starting incremental compilation'))
        return;
  
      let filteredOutput = log.replace(/\x1Bc|\x1B\[2J\x1B\[0;0H/g, ''); // char sequence for clearing terminal
      if (filteredOutput.includes('Watching for file changes.'))
        filteredOutput = filteredOutput.replace(/^\n/, '');

      if (filteredOutput.trim() == '')
        return;

      // Replace newline with newline+prefix under the following conditions:
      // 1. It is not at the start of the string (?<!^)
      // 2. It is not at the end of the string (?!$)
      // 3. It is not followed by another newline (?!\r?\n)
      filteredOutput = filteredOutput.replace(/(?<!^)(\r?\n)(?!\r?\n|$)/g, `$1${logPrefix}`);

      if (!inMultiLineLog)
        filteredOutput = `${logPrefix}${filteredOutput}`;

      if (filteredOutput.endsWith('\n') || filteredOutput.endsWith('\r\n'))
        inMultiLineLog = false;
      else
        inMultiLineLog = true;
  
      return filteredOutput;
    };
    cmd('npm', ['run', 'watch'], { cwd: packageDir }, { 
      omitLogs: { 
        stdout: {
          filter: stdoutFilter,
        }
      }, 
    });
  }
}