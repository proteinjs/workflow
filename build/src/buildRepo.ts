import * as path from 'path'
const graphlib = require('@dagrejs/graphlib')
import { PackageUtil, cmd } from '@brentbahry/util-server'
import { Logger } from '@brentbahry/util'

export const buildRepo = async () => {
  const logger = new Logger('buildRepo', 'debug');
  logger.info(`> Building proteinjs workspace`);
  const repoPath = path.resolve(__dirname, '../../..'); // __dirname: build/dist/src/
  logger.debug(`repoPath: ${repoPath}`);
  const packageMap = await PackageUtil.getLocalPackageMap(repoPath, ['**/test/**']);
  logger.debug(`packageMap:\n${JSON.stringify(packageMap, null, 2), true}`);
  const packageGraph = await PackageUtil.getPackageDependencyGraph(Object.values(packageMap).map(localPackage => localPackage.packageJson));
  const sortedPackageNames: string[] = graphlib.alg.topsort(packageGraph).reverse();
  logger.debug(`sortedPackageNames:\n${JSON.stringify(sortedPackageNames, null, 2), true}`);

  logger.info(`> Installing packages`);
  for (let packageName of sortedPackageNames) {
    const localPackage = packageMap[packageName];
    if (!localPackage)
      continue;

    const packageDir = path.dirname(localPackage.filePath);
    await cmd('npm', ['install'], { cwd: packageDir });
    logger.info(`Installed ${packageName}`);
  }

  logger.info(`> Building packages`);
  for (let packageName of sortedPackageNames) {
    const localPackage = packageMap[packageName];
    if (!localPackage)
      continue;

    const packageDir = path.dirname(localPackage.filePath);
    await cmd('npm', ['run', 'build'], { cwd: packageDir });
    logger.info(`Built ${packageName}`);
  }
}