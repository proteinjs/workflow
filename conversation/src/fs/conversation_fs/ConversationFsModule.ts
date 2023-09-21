import { ConversationModule, ConversationModuleFactory } from '../../ConversationModule';
import { Function } from '../../Function';
import { ConversationFsModerator } from './ConversationFsModerator';
import { fsFunctions } from './FsFunctions';

export class ConversationFsModule implements ConversationModule {
  private repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
  }
  
  getSystemMessages(): string[] {
    return [
      `Assume the current working directory is: ${this.repoPath} unless specified by the user`,
      `Pre-pend the current working directory as the base path to file paths when performing file operations, unless specified otherwise by the user`,
    ];
  }

  getFunctions(): Function[] {
    return fsFunctions;
  }

  getMessageModerators() {
    return [
      new ConversationFsModerator(),
    ];
  }
}

export class ConversationFsModuleFactory implements ConversationModuleFactory {
  async createModule(repoPath: string): Promise<ConversationFsModule> {
    return new ConversationFsModule(repoPath);
  }
}