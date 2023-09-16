import { ChatCompletionMessageParam } from 'openai/resources/chat';
import openai from './openai';

export class Conversation {
  private history: ChatCompletionMessageParam[] = [];
  private generatedCode = false;
  private generatedList = false;
  private omitUsageData: boolean;

  constructor(omitUsageData = false) {
    this.omitUsageData = omitUsageData;
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
    const response = await openai.generateResponse(messages, model, this.history, this.omitUsageData);
    messages.forEach(message => this.history.push({ role: 'user', content: message }));
    this.history.push({ role: 'assistant', content: response });
    return response;
  }

  async generateCode(description: string[], model?: string) {
    const code = await openai.generateCode(description, model, this.history, !this.generatedCode, this.omitUsageData);
    this.generatedCode = true;
    description.forEach(message => this.history.push({ role: 'user', content: message }));
    this.history.push({ role: 'assistant', content: code });
    return code;
  }

  async updateCode(code: string, description: string, model?: string) {
    const updatedCode = await openai.updateCode(code, description, model, this.history, !this.generatedCode, this.omitUsageData);
    this.generatedCode = true;
    this.history.push({ role: 'user', content: openai.updateCodeDescription(code, description) });
    this.history.push({ role: 'assistant', content: updatedCode });
    return updatedCode;
  }

  async generateList(description: string[], model?: string) {
    const list = await openai.generateList(description, model, this.history, !this.generatedList, this.omitUsageData);
    this.generatedList = true;
    description.forEach(message => this.history.push({ role: 'user', content: message }));
    this.history.push({ role: 'assistant', content: list.join('\n') });
    return list;
  }
}