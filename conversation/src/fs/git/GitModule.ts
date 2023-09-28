import { gitFunctions } from '@brentbahry/util';
import { ConversationModule, ConversationModuleFactory } from '../../ConversationModule';
import { Function } from '../../Function';

export class GitModule implements ConversationModule {
  private repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
  }

  getName(): string {
    return 'Git';
  }

  getSystemMessages(): string[] {
    return [
      
    ];
  }

  getFunctions(): Function[] {
    return [
      ...gitFunctions,
    ];
  }

  getMessageModerators() {
    return [];
  }
}

export class GitModuleFactory implements ConversationModuleFactory {
  async createModule(repoPath: string): Promise<GitModule> {
    return new GitModule(repoPath);
  }
}