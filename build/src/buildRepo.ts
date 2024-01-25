import * as path from 'path'
const graphlib = require('@dagrejs/graphlib')
import { PackageUtil, cmd } from '@brentbahry/util-server'
import { Logger } from '@brentbahry/util'

export const buildRepo = async () => {
  const logger = new Logger('buildRepo');
  logger.info(`> Building proteinjs workspace`);
  const repoPath = path.resolve(__dirname, '../../..'); // __dirname: build/dist/src
  const packageMap = await PackageUtil.getLocalPackageMap(repoPath);
  const packageGraph = await PackageUtil.getPackageDependencyGraph(Object.values(packageMap).map(localPackage => localPackage.packageJson));
  const sortedPackageNames: string[] = graphlib.alg.topsort(packageGraph).reverse();
  
  logger.info(`> Installing packages`);
  for (let packageName of sortedPackageNames) {
    const localPackage = packageMap[packageName];
    const packageDir = path.dirname(localPackage.filePath);
    await cmd('npm', ['install'], { cwd: packageDir });
    logger.info(`Installed ${packageName}`);
  }

  logger.info(`> Building packages`);
  for (let packageName of sortedPackageNames) {
    const localPackage = packageMap[packageName];
    const packageDir = path.dirname(localPackage.filePath);
    await cmd('npm', ['run', 'build'], { cwd: packageDir });
    logger.info(`Built ${packageName}`);
  }
}