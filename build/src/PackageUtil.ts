import path from 'path';
import fsExtra from 'fs-extra';
import globby from 'globby';
const graphlib = require('@dagrejs/graphlib');

export type LocalPackage = {
  filePath: string, 
  packageJson: any
};

export class PackageUtil {
  static async readFile(filePath: string) {
    if (!(await fsExtra.exists(filePath)))
      throw new Error(`File does not exist at path: ${filePath}`);
    
    const fileContent = (await fsExtra.readFile(filePath)).toString();
    if (!fileContent)
      throw new Error(`File is empty: ${filePath}`);

    return fileContent;
  }

  // @param dirPrefix recursively search for files in this dir
  // @param glob file matching pattern ie. **/package.json
  // @param globIgnorePatterns ie. ['**/node_modules/**', '**/dist/**'] to ignore these directories
  // @return string[] of file paths
  static async getFilePathsMatchingGlob(dirPrefix: string, glob: string, globIgnorePatterns: string[] = []) {
    if (dirPrefix[dirPrefix.length - 1] != path.sep)
      dirPrefix += path.sep;

    return await globby(dirPrefix + glob, {
      ignore: [...globIgnorePatterns]
    });
  }

  /**
   * Get map of local packages within repo specified by directory path
   * 
   * @param dir dir path that contains local packages
   * @param globIgnorePatterns already includes: ['**\/node_modules/**', '**\/dist/**']
   * @returns {[packageName: string]: LocalPackage}
   */
  static async getLocalPackageMap(dir: string, globIgnorePatterns: string[] = []) {
    const packageMap: {[packageName: string]: LocalPackage} = {};
    const filePaths = await PackageUtil.getFilePathsMatchingGlob(dir, '**/package.json', ['**/node_modules/**', '**/dist/**', ...globIgnorePatterns]);
    for (let filePath of filePaths) {
      const packageJson = JSON.parse(await PackageUtil.readFile(filePath));
      const name = packageJson['name'];
      packageMap[name] = { filePath, packageJson };
    }

    return packageMap;
  }

  /**
   * Generate a dependency graph of package names. 
   * It will crawl through dependencies and devDependencies in the provided packageJsons. 
   * If packagea depends on packageb, nodes with ids packagea and packageb will be added to the graph. 
   * An edge from packagea -> packageb will be added to the graph as well.
   * 
   * You can get dependency order of packages by calling: @dagrejs/graphlib.alg.topsort(graph).reverse()
   * 
   * @param packageJsons an array of package.json objects
   * @returns a @dagrejs/graphlib.Graph
   */
  static async getPackageDependencyGraph(packageJsons: any[]) {
    const graph = new graphlib.Graph();
    for (let packageJson of packageJsons) {
      const packageName = packageJson['name'];
      if (!graph.hasNode(packageName))
        graph.setNode(packageName);

      PackageUtil.addDependencies(packageName, packageJson['dependencies'], graph);
      PackageUtil.addDependencies(packageName, packageJson['devDependencies'], graph);
    }

    return graph;
  }

  private static addDependencies(sourcePackageName: string, dependencies: any, graph: any) {
    if (!dependencies)
      return;

    for (let dependencyPackageName of Object.keys(dependencies)) {
      const dependencyPackageVersion = dependencies[dependencyPackageName] as string;
      if (!(dependencyPackageVersion.startsWith('file:') || dependencyPackageVersion.startsWith('.')))
        continue;

      if (!graph.hasNode(dependencyPackageName))
        graph.setNode(dependencyPackageName);

      graph.setEdge(sourcePackageName, dependencyPackageName);
    }
  }
}