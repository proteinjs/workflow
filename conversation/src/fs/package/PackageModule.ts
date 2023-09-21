import { Fs } from '@brentbahry/util';
import { ConversationModule, ConversationModuleFactory } from '../../ConversationModule';
import { Function } from '../../Function';
import { packageFunctions, searchPackagesFunction } from './PackageFunctions';

export class PackageModule implements ConversationModule {
  private repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
  }

  getSystemMessages(): string[] {
    return [
      `When generating code, prefer importing code from local packages`,
      `When generating code, use the searchFiles function to find all file paths to index.ts files; these are the local apis we have access to`,
      `When generating import statements, use the searchFiles function to find all file paths to package.json files; if importing from a local package, make sure you import via its package if it is not a local file to the package we're generating code in`,
    ];
  }

  getFunctions(): Function[] {
    return [
      ...packageFunctions,
      searchPackagesFunction(this),
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
    const packageJsonPaths: string[] = [];
    const packageJsonFilePaths = await Fs.getFilePathsMatchingGlob(this.repoPath, '**/package.json', ['**/node_modules/**', '**/dist/**']);
    const packageJsonFileMap = await Fs.readFiles({ filePaths: packageJsonFilePaths });
    for (let packageJsonFilePath of Object.keys(packageJsonFileMap)) {
      const packageJson = JSON.parse(packageJsonFileMap[packageJsonFilePath]);
      if (packageJson.name.toLowerCase().includes(keyword.toLocaleLowerCase()))
        packageJsonPaths.push(packageJsonFilePath);
    }

    return packageJsonPaths;
  }
}

export class PackageModuleFactory implements ConversationModuleFactory {
  async createModule(repoPath: string): Promise<PackageModule> {
    return new PackageModule(repoPath);
  }
}