import * as path from 'path'
import { PackageUtil, cmd, RepoMetadata } from '@proteinjs/util-node'
import { Logger } from '@proteinjs/util'

export const testRepo = async (repoMetadata?: RepoMetadata) => {
  const logger = new Logger('testRepo');
  const repoPath = path.resolve(__dirname, '../../..'); // __dirname: build/dist
  const { packageMap, sortedPackageNames } = repoMetadata ? repoMetadata : await PackageUtil.getRepoMetadata(repoPath);
  const filteredPackageNames = sortedPackageNames.filter(packageName => !!packageMap[packageName].packageJson.scripts?.test && packageName != 'typescript-parser');

  logger.info(`> Testing ${filteredPackageNames.length} packages in the proteinjs workspace (${repoPath})`);
  for (let packageName of filteredPackageNames) {
    const localPackage = packageMap[packageName];
    const packageDir = path.dirname(localPackage.filePath);
    if (!await PackageUtil.hasTests(packageDir))
      continue;

    await cmd('npm', ['run', 'test'], { cwd: packageDir });
  }
  logger.info(`> Finished testing ${filteredPackageNames.length} packages in the proteinjs workspace (${repoPath})`);
}