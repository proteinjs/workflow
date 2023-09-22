import { ConversationModule, ConversationModuleFactory } from '../../ConversationModule';
import { Function } from '../../Function';
import { ConversationFsModerator } from './ConversationFsModerator';
import { fsFunctions, readFilesFunction, writeFilesFunction } from './FsFunctions';

export class ConversationFsModule implements ConversationModule {
  private repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
  }
  
  getSystemMessages(): string[] {
    return [
      `Assume the current working directory is: ${this.repoPath} unless specified by the user`,
      `Pre-pend the current working directory as the base path to file paths when performing file operations, unless specified otherwise by the user`,
      `If the user asks to change the cwd, do not create a new folder, just fail if it's not a valid path`,
      `You have access to code in a local repo, you can read and write code to and from the file system with the ${readFilesFunction.definition.name} function and the ${writeFilesFunction.definition.name} function`,
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