import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { OpenAi } from './OpenAi';
import { MessageHistory } from './MessageHistory';
import { Function } from './Function';
import { Logger, LogLevel, Fs } from '@brentbahry/util';
import { MessageModerator } from './MessageModerator';
import { ConversationFileSystemModerator } from './ConversationFileSystemModerator';

export class Conversation {
  private history = new MessageHistory();
  private functions: Function[] = [];
  private messageModerators: MessageModerator[] = [];
  private generatedCode = false;
  private generatedList = false;
  private logger: Logger;
  private logging: { conversationName: string, logLevel?: LogLevel };

  constructor(logging: { conversationName: string, logLevel?: LogLevel }) {
    this.logging = logging;
    this.logger = new Logger(logging.conversationName, logging.logLevel);
    this.messageModerators.push(new ConversationFileSystemModerator(logging.logLevel));
  }

  addFunctions(functions: Function[]) {
    this.functions.push(...functions);
    for (let f of functions) {
      if (f.instructions) {
        const mps: ChatCompletionMessageParam[] = f.instructions.map(instruction => { return { role: 'system', content: instruction }});
        this.history.push(mps);
      }
    }
  }

  addMessageModerators(messageModerators: MessageModerator[]) {
    this.messageModerators.push(...messageModerators);
  }

  addSystemMessagesToHistory(messages: string[]) {
   this.history.push(messages.map(message => { return { role: 'system', content: message }}));
  }

  addAssistantMessagesToHistory(messages: string[]) {
    this.history.push(messages.map(message => { return { role: 'assistant', content: message }}));
  }

  addUserMessagesToHistory(messages: string[]) {
    this.history.push(messages.map(message => { return { role: 'user', content: message }}));
  }

  async generateResponse(messages: string[], model?: string) {
    return await OpenAi.generateResponse(messages, model, this.history, this.functions, this.messageModerators, this.logging.logLevel);
  }

  async generateCode(description: string[], model?: string) {
    this.logger.info(`Generating code for description:\n${description.join('\n')}`);
    const code = await OpenAi.generateCode(description, model, this.history, this.functions, this.messageModerators, !this.generatedCode, this.logging.logLevel);
    this.logger.info(`Generated code:\n${code.slice(0, 150)}${code.length > 150 ? '...' : ''}`);
    this.generatedCode = true;
    return code;
  }

  async updateCodeFromFile(codeToUpdateFilePath: string, dependencyCodeFilePaths: string[], description: string, model?: string) {
    const codeToUpdate = await Fs.readFile(codeToUpdateFilePath);
    let dependencyDescription = `Assume the following exists:\n`;
    for (let dependencyCodeFilePath of dependencyCodeFilePaths) {
      const dependencCode = await Fs.readFile(dependencyCodeFilePath);
      dependencyDescription += dependencCode + '\n\n';
    }

    this.logger.info(`Updating code from file: ${codeToUpdateFilePath}`);
    return await this.updateCode(codeToUpdate, dependencyDescription + description, model);
  }

  async updateCode(code: string, description: string, model?: string) {
    this.logger.info(`Updating code:\n${code.slice(0, 150)}${code.length > 150 ? '...' : ''}\nFrom description: ${description}`);
    const updatedCode = await OpenAi.updateCode(code, description, model, this.history, this.functions, this.messageModerators, !this.generatedCode, this.logging.logLevel);
    this.logger.info(`Updated code:\n${updatedCode.slice(0, 150)}${updatedCode.length > 150 ? '...' : ''}`);
    this.generatedCode = true;
    return updatedCode;
  }

  async generateList(description: string[], model?: string) {
    const list = await OpenAi.generateList(description, model, this.history, this.functions, this.messageModerators, !this.generatedList, this.logging.logLevel);
    this.generatedList = true;
    return list;
  }
}