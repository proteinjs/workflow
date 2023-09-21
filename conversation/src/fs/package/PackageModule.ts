import { ConversationModule, ConversationModuleFactory } from '../../ConversationModule';
import { Function } from '../../Function';
import { packageFunctions } from './PackageFunctions';

export class PackageModule implements ConversationModule {
  getSystemMessages(): string[] {
    return [];
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