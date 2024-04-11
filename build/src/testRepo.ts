import * as path from 'path'
const graphlib = require('@dagrejs/graphlib')
import { PackageUtil, cmd, Fs } from '@proteinjs/util-node'
import { Logger } from '@proteinjs/util'

export const testRepo = async () => {
  const logger = new Logger('testRepo');
  const repoPath = path.resolve(__dirname, '../../..'); // __dirname: build/dist
  const localPackageMap = await PackageUtil.getLocalPackageMap(repoPath, ['**/reflection-build/test/**']);
  const packageDependencyGraph = await PackageUtil.getPackageDependencyGraph(Object.values(localPackageMap).map(localPackage => localPackage.packageJson));
  const sortedLocalPackageNames = (graphlib.alg.topsort(packageDependencyGraph).reverse() as string[]).filter(packageName => !!localPackageMap[packageName]);
  const filteredPackageNames = sortedLocalPackageNames.filter(packageName => !!localPackageMap[packageName].packageJson.scripts?.test);

  logger.info(`> Testing ${filteredPackageNames.length} packages in the proteinjs workspace (${repoPath})`);
  for (let packageName of filteredPackageNames) {
    if (packageName == 'typescript-parser')
      continue;

    const localPackage = localPackageMap[packageName];
    const packageDir = path.dirname(localPackage.filePath);
    if (!await PackageUtil.hasTests(packageDir))
      continue;

    await cmd('npm', ['run', 'test'], { cwd: packageDir });
  }
  logger.info(`> Finished testing ${sortedLocalPackageNames.length} packages in the proteinjs workspace (${repoPath})`);
}