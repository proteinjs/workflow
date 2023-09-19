import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { OpenAi, Function } from './OpenAi';
import { Logger, LogLevel, Fs } from '@brentbahry/util';
import { MessageModerator } from './MessageModerator';
import { ConversationFileSystemModerator } from './ConversationFileSystemModerator';

export class Conversation {
  private history: ChatCompletionMessageParam[] = [];
  private functions: Function[] = [];
  private messageModerators: MessageModerator[] = [new ConversationFileSystemModerator()];
  private generatedCode = false;
  private generatedList = false;
  private logger: Logger;
  private logging: { conversationName: string, omitUsageData?: boolean };

  constructor(logging: { conversationName: string, omitUsageData?: boolean, logLevel?: LogLevel }) {
    this.logging = logging;
    this.logger = new Logger(logging.conversationName, logging.logLevel);
  }

  addFunctions(functions: Function[]) {
    this.functions.push(...functions);
    for (let f of functions) {
      if (f.instructions) {
        const mps: ChatCompletionMessageParam[] = f.instructions.map(instruction => { return { role: 'system', content: instruction }});
        this.history.push(...mps);
      }
    }
  }

  addMessageModerators(messageModerators: MessageModerator[]) {
    this.messageModerators.push(...messageModerators);
  }

  private moderateHistory() {
    for (let messageModerator of this.messageModerators)
      this.history = messageModerator.observe(this.history);
  }

  addSystemMessagesToHistory(messages: string[]) {
    messages.forEach(message => this.history.push({ role: 'system', content: message }));
  }

  addAssistantMessagesToHistory(messages: string[]) {
    messages.forEach(message => this.history.push({ role: 'assistant', content: message }));
  }

  addUserMessagesToHistory(messages: string[]) {
    messages.forEach(message => this.history.push({ role: 'user', content: message }));
  }

  async generateResponse(messages: string[], model?: string) {
    this.moderateHistory();
    const response = await OpenAi.generateResponse(messages, model, this.history, this.functions, this.logging.omitUsageData);
    messages.forEach(message => this.history.push({ role: 'user', content: message }));
    this.history.push({ role: 'assistant', content: response });
    return response;
  }

  async generateCode(description: string[], model?: string) {
    this.moderateHistory();
    this.logger.info(`Generating code for description:\n${description.join('\n')}`);
    const code = await OpenAi.generateCode(description, model, this.history, this.functions, !this.generatedCode, this.logging.omitUsageData);
    this.logger.info(`Generated code:\n${code.slice(0, 150)}${code.length > 150 ? '...' : ''}`);
    this.generatedCode = true;
    description.forEach(message => this.history.push({ role: 'user', content: message }));
    this.history.push({ role: 'assistant', content: code });
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
    this.moderateHistory();
    this.logger.info(`Updating code:\n${code.slice(0, 150)}${code.length > 150 ? '...' : ''}\nFrom description: ${description}`);
    const updatedCode = await OpenAi.updateCode(code, description, model, this.history, this.functions, !this.generatedCode, this.logging.omitUsageData);
    this.logger.info(`Updated code:\n${updatedCode.slice(0, 150)}${updatedCode.length > 150 ? '...' : ''}`);
    this.generatedCode = true;
    this.history.push({ role: 'user', content: OpenAi.updateCodeDescription(code, description) });
    this.history.push({ role: 'assistant', content: updatedCode });
    return updatedCode;
  }

  async generateList(description: string[], model?: string) {
    this.moderateHistory();
    const list = await OpenAi.generateList(description, model, this.history, this.functions, !this.generatedList, this.logging.omitUsageData);
    this.generatedList = true;
    description.forEach(message => this.history.push({ role: 'user', content: message }));
    this.history.push({ role: 'assistant', content: list.join('\n') });
    return list;
  }
}