import { ChatCompletionMessageParam } from 'openai/resources/chat';
import openai from './openai';
import { Logger, LogLevel, Fs } from '@brentbahry/util';

export class Conversation {
  private history: ChatCompletionMessageParam[] = [];
  private generatedCode = false;
  private generatedList = false;
  private logger: Logger;
  private logging: { conversationName: string, omitUsageData?: boolean };

  constructor(logging: { conversationName: string, omitUsageData?: boolean, logLevel?: LogLevel }) {
    this.logging = logging;
    this.logger = new Logger(logging.conversationName, logging.logLevel);
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
    const response = await openai.generateResponse(messages, model, this.history, this.logging.omitUsageData);
    messages.forEach(message => this.history.push({ role: 'user', content: message }));
    this.history.push({ role: 'assistant', content: response });
    return response;
  }

  async generateCode(description: string[], model?: string) {
    this.logger.info(`Generating code for description:\n${description.join('\n')}`);
    const code = await openai.generateCode(description, model, this.history, !this.generatedCode, this.logging.omitUsageData);
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
    this.logger.info(`Updating code:\n${code.slice(0, 150)}${code.length > 150 ? '...' : ''}\nFrom description: ${description}`);
    const updatedCode = await openai.updateCode(code, description, model, this.history, !this.generatedCode, this.logging.omitUsageData);
    this.logger.info(`Updated code:\n${updatedCode.slice(0, 150)}${updatedCode.length > 150 ? '...' : ''}`);
    this.generatedCode = true;
    this.history.push({ role: 'user', content: openai.updateCodeDescription(code, description) });
    this.history.push({ role: 'assistant', content: updatedCode });
    return updatedCode;
  }

  async generateList(description: string[], model?: string) {
    const list = await openai.generateList(description, model, this.history, !this.generatedList, this.logging.omitUsageData);
    this.generatedList = true;
    description.forEach(message => this.history.push({ role: 'user', content: message }));
    this.history.push({ role: 'assistant', content: list.join('\n') });
    return list;
  }
}