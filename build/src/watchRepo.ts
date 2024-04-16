import * as path from 'path'
import { PackageUtil, RepoMetadata, cmd } from '@proteinjs/util-node'
import { Logger } from '@proteinjs/util'

export const watchRepo = async (repoMetadata?: RepoMetadata) => {
  const logger = new Logger('watchRepo');
  const repoPath = path.resolve(__dirname, '../../..'); // __dirname: build/dist
  const { packageMap, sortedPackageNames } = repoMetadata ? repoMetadata : await PackageUtil.getRepoMetadata(repoPath);

  logger.info(`> Watching ${sortedPackageNames.length} packages in the proteinjs workspace (${repoPath})`);
  const loggingStartDelay = 0;
  for (let packageName of sortedPackageNames) {
    const localPackage = packageMap[packageName];
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