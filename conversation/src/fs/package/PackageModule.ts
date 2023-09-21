import { ConversationModule, ConversationModuleFactory } from '../../ConversationModule';
import { Function } from '../../Function';
import { packageFunctions } from './PackageFunctions';

export class PackageModule implements ConversationModule {
  getSystemMessages(): string[] {
    return [
      `When generating code, prefer importing code from local packages`,
      `When generating code, use the searchFiles function to find all file paths to index.ts files; these are the local apis we have access to`,
      `When generating import statements, use the searchFiles function to find all file paths to package.json files; if importing from a local package, make sure you import via its package if it is not a local file to the package we're generating code in`,
    ];
  }

  getFunctions(): Function[] {
    return packageFunctions;
  }

  getMessageModerators() {
    return [];
  }
}

export class PackageModuleFactory implements ConversationModuleFactory {
  async createModule(repoPath: string): Promise<PackageModule> {
    return new PackageModule();
  }
}