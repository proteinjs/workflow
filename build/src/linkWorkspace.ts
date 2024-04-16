import * as path from 'path'
import { PackageUtil, cmd, Fs, WorkspaceMetadata } from '@proteinjs/util-node'
import { Logger } from '@proteinjs/util'

export async function linkWorkspace(workspaceMetadata?: WorkspaceMetadata) {
  const logger = new Logger('linkWorkspace');
  const workspacePath = path.resolve(__dirname, '../../../util'); // __dirname: build/dist
  logger.info(`> Linking local packages in workspace (${workspacePath})`);
  const { packageMap, sortedPackageNames } = workspaceMetadata ? workspaceMetadata : await PackageUtil.getWorkspaceMetadata(workspacePath);
  logger.debug(`packageMap:\n${JSON.stringify(packageMap, null, 2)}`, true);
  logger.debug(`sortedPackageNames:\n${JSON.stringify(sortedPackageNames, null, 2)}`, true);

  for (let packageName of sortedPackageNames) {
    const localPackage = packageMap[packageName];
    const packageDir = path.dirname(localPackage.filePath);
    const nodeModulesPath = path.resolve(packageDir, 'node_modules');
    if (!await Fs.exists(nodeModulesPath))
      await Fs.createFolder(nodeModulesPath);

    await linkDependencies(localPackage.packageJson.dependencies, packageMap, packageDir, nodeModulesPath, logger);
    await linkDependencies(localPackage.packageJson.devDependencies, packageMap, packageDir, nodeModulesPath, logger);
  }

  logger.info(`> Linked local packages in workspace (${workspacePath})`);
}

async function linkDependencies(
  dependencies: Record<string, string> | undefined,
  packageMap: Record<string, any>,
  packageDir: string,
  nodeModulesPath: string,
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
    logger.debug(`Symlinked dependency (${dependencyPackageName}) ${dependencyPath} -> ${symlinkPath}`);
  }
};
