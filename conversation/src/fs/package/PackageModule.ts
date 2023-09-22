import { Fs, PackageUtil } from '@brentbahry/util';
import { ConversationModule, ConversationModuleFactory } from '../../ConversationModule';
import { Function } from '../../Function';
import { packageFunctions, searchLibrariesFunction, searchPackagesFunction } from './PackageFunctions';
import path from 'path';

export type Library = {
  fileName: string,
  filePath: string,
  packageName: string,
}

export type LibraryImport = {
  importStatements: string[],
  typescriptDeclaration: string,
}

export class PackageModule implements ConversationModule {
  private repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
  }

  getSystemMessages(): string[] {
    return [
      `When generating code, prefer importing code from local packages`,
      // `When generating code, use the searchFiles function to find all file paths to index.ts files; these are the local apis we have access to`,
      // `When generating import statements, use the searchFiles function to find all file paths to package.json files; if importing from a local package, make sure you import via its package if it is not a local file to the package we're generating code in`,
    ];
  }

  getFunctions(): Function[] {
    return [
      ...packageFunctions,
      searchPackagesFunction(this),
      searchLibrariesFunction(this),
    ];
  }

  getMessageModerators() {
    return [];
  }

  /**
   * @param keyword either the package name or some substring
   * @return string[] of file paths
   */
  async searchPackages(keyword: string): Promise<string[]> {
    const matchingPackageJsonPaths: string[] = [];
    const packageJsonFilePaths = await Fs.getFilePathsMatchingGlob(this.repoPath, '**/package.json', ['**/node_modules/**', '**/dist/**']);
    const packageJsonFileMap = await Fs.readFiles({ filePaths: packageJsonFilePaths });
    for (let packageJsonFilePath of Object.keys(packageJsonFileMap)) {
      const packageJson = JSON.parse(packageJsonFileMap[packageJsonFilePath]);
      if (packageJson.name.toLowerCase().includes(keyword.toLocaleLowerCase()))
        matchingPackageJsonPaths.push(packageJsonFilePath);
    }

    return matchingPackageJsonPaths;
  }

  /**
   * Search packages in repo for file names that include keyword
   * @param keyword substring of file name to search for
   * @returns all libraries in the repo matching the keyword
   */
  async searchLibraries(keyword: string): Promise<Library[]> {
    const matchingLibraries: Library[] = [];
    const packageJsonFilePaths = await Fs.getFilePathsMatchingGlob(this.repoPath, '**/package.json', ['**/node_modules/**', '**/dist/**']);
    const packageJsonFileMap = await Fs.readFiles({ filePaths: packageJsonFilePaths });
    for (let packageJsonFilePath of Object.keys(packageJsonFileMap)) {
      const packageJson = JSON.parse(packageJsonFileMap[packageJsonFilePath]);
      const packageJsonFilePathParts = packageJsonFilePath.split(path.sep);
      packageJsonFilePathParts.pop();
      const packageDirectory = packageJsonFilePathParts.join(path.sep);
      const srcFilePaths = await Fs.getFilePathsMatchingGlob(path.join(packageDirectory, 'src'), '**/*.ts', ['**/node_modules/**', '**/dist/**']);
      for (let srcFilePath of srcFilePaths) {
        const fileNameWithExtension = path.basename(srcFilePath);
        if (fileNameWithExtension.includes(keyword)) {
          const fileName = path.basename(srcFilePath, path.extname(srcFilePath));
          matchingLibraries.push({
            fileName,
            filePath: srcFilePath,
            packageName: packageJson.name,
          });
        }
      }
    }

    return matchingLibraries;
  }
}

export class PackageModuleFactory implements ConversationModuleFactory {
  async createModule(repoPath: string): Promise<PackageModule> {
    return new PackageModule(repoPath);
  }
}