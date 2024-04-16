import * as path from 'path'
import { PackageUtil, cmd, Fs, RepoMetadata } from '@proteinjs/util-node'
import { Logger } from '@proteinjs/util'

export async function linkRepo(repoMetadata?: RepoMetadata) {
  const logger = new Logger('linkRepo');
  const repoPath = path.resolve(__dirname, '..'); // __dirname: build
  logger.info(`> Linking local packages in proteinjs workspace (${repoPath})`);
  const { packageMap, sortedPackageNames } = repoMetadata ? repoMetadata : await PackageUtil.getRepoMetadata(repoPath);
  logger.debug(`packageMap:\n${JSON.stringify(packageMap, null, 2)}`, true);
  logger.debug(`sortedPackageNames:\n${JSON.stringify(sortedPackageNames, null, 2)}`, true);

  for (let packageName of sortedPackageNames) {
    const localPackage = packageMap[packageName];
    if (!localPackage)
      continue;

    const packageDir = path.dirname(localPackage.filePath);
    const nodeModulesPath = path.resolve(packageDir, 'node_modules');
    if (!await Fs.exists(nodeModulesPath))
      await Fs.createFolder(nodeModulesPath);

    await linkDependencies(localPackage.packageJson.dependencies, packageMap, nodeModulesPath, packageDir, logger);
    await linkDependencies(localPackage.packageJson.devDependencies, packageMap, nodeModulesPath, packageDir, logger);
  }

  logger.info(`> Linked local packages in proteinjs workspace (${repoPath})`);
}

async function linkDependencies(
  dependencies: Record<string, string> | undefined,
  packageMap: Record<string, any>,
  nodeModulesPath: string,
  packageDir: string,
  logger: Logger
) {
  if (!dependencies)
    return;

  for (let dependencyPackageName in dependencies) {
    const dependencyPath = packageMap[dependencyPackageName]?.filePath ? path.dirname(packageMap[dependencyPackageName].filePath) : null;
    if (!dependencyPath)
      continue;

    const symlinkPath = path.join(nodeModulesPath, dependencyPackageName);
    if (await Fs.exists(symlinkPath))
      await Fs.deleteFolder(symlinkPath);

    await cmd('ln', ['-s', dependencyPath, symlinkPath], { cwd: packageDir });
    logger.debug(`Symlinked dependency ${dependencyPackageName} -> ${symlinkPath}`);
  }
};
