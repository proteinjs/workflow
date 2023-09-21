import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { OpenAi } from './OpenAi';
import { MessageHistory } from './history/MessageHistory';
import { Function } from './Function';
import { Logger, LogLevel, Fs } from '@brentbahry/util';
import { MessageModerator } from './history/MessageModerator';
import { ConversationModule } from './ConversationModule';

export type ConversationParams = {
  name: string,
  modules?: ConversationModule[];
  logLevel?: LogLevel;
}

export class Conversation {
  private history = new MessageHistory();
  private functions: Function[] = [];
  private messageModerators: MessageModerator[] = [];
  private generatedCode = false;
  private generatedList = false;
  private logger: Logger;
  private params: ConversationParams;

  constructor(params: ConversationParams) {
    this.params = params;
    this.logger = new Logger(params.name, params.logLevel);
    if (params.modules)
      this.addModules(params.modules);
  }

  private addModules(modules: ConversationModule[]) {
    for (let module of modules) {
      this.addSystemMessagesToHistory(module.getSystemMessages());
      this.addFunctions(module.getFunctions());
      this.addMessageModerators(module.getMessageModerators());
    }
  }

  private addFunctions(functions: Function[]) {
    this.functions.push(...functions);
    for (let f of functions) {
      if (f.instructions) {
        const mps: ChatCompletionMessageParam[] = f.instructions.map(instruction => { return { role: 'system', content: instruction }});
        this.history.push(mps);
      }
    }
  }

  private addMessageModerators(messageModerators: MessageModerator[]) {
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
    return await OpenAi.generateResponse(messages, model, this.history, this.functions, this.messageModerators, this.params.logLevel);
  }

  async generateCode(description: string[], model?: string) {
    this.logger.info(`Generating code for description:\n${description.join('\n')}`);
    const code = await OpenAi.generateCode(description, model, this.history, this.functions, this.messageModerators, !this.generatedCode, this.params.logLevel);
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
    const updatedCode = await OpenAi.updateCode(code, description, model, this.history, this.functions, this.messageModerators, !this.generatedCode, this.params.logLevel);
    this.logger.info(`Updated code:\n${updatedCode.slice(0, 150)}${updatedCode.length > 150 ? '...' : ''}`);
    this.generatedCode = true;
    return updatedCode;
  }

  async generateList(description: string[], model?: string) {
    const list = await OpenAi.generateList(description, model, this.history, this.functions, this.messageModerators, !this.generatedList, this.params.logLevel);
    this.generatedList = true;
    return list;
  }
}