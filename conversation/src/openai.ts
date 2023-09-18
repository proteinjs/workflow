import { OpenAI } from 'openai';
import { ChatCompletionCreateParams, ChatCompletionMessage, ChatCompletionMessageParam } from 'openai/resources/chat';
import { Logger } from '@brentbahry/util';

export interface Function {
  definition: ChatCompletionCreateParams.Function;
  call(obj: any): Promise<any>;
}

export interface FunctionReturnMessage {
  role: string, 
  name: string, 
  content: string,
}

export class OpenAi {
  static async generateResponse(messages: string[], model?: string, history?: ChatCompletionMessageParam[], functions?: Function[], omitUsageData = false): Promise<string> {
    const logger = new Logger('generateResponse');
    const openai = new OpenAI();
    const messageParams: ChatCompletionMessageParam[] = messages.map(message => { return { role: 'user', content: message }});
    if (history)
      history.push(...messageParams);
    const messageParamsWithHistory = history ? history : messageParams;
    const response = await openai.chat.completions.create({
      model: model ? model : 'gpt-3.5-turbo',
      temperature: 0,
      messages: messageParamsWithHistory,
      functions: functions?.map(f => f.definition),
    });

    if (!omitUsageData) {
      if (response.usage)
        logger.info(JSON.stringify(response.usage));
      else
        logger.info(JSON.stringify(`Usage data missing`));
    }

    const responseMessage = response.choices[0].message;
    if (responseMessage.function_call) {
      const functionReturnMessage = await this.callFunction(logger, functions, responseMessage.function_call);
      if (functionReturnMessage) {
        messageParamsWithHistory.push(...[responseMessage, functionReturnMessage]);
        return await this.generateResponse([], model, messageParamsWithHistory, functions, omitUsageData);
      }
    }

    const responseText = responseMessage.content;
    if (!responseText) {
      logger.error(`Received response: ${JSON.stringify(response)}`);
      throw new Error(`Response was empty for messages: ${messages.join('\n')}`);
    }

    return responseText;
  }

  private static async callFunction(logger: Logger, functions?: Function[], functionCall?: ChatCompletionMessage.FunctionCall): Promise<ChatCompletionMessageParam|undefined> {
    if (!functions) {
      logger.warn(`Assistant attempted to call a function when no functions were provided`);
      return;
    }      

    if (functions && functionCall) {
      const f = functions.find(f => f.definition.name === functionCall.name)
      if (!f) {
        logger.warn(`Assistant attempted to call nonexistent function: ${functionCall.name}`);
        return;
      }

      const returnObject = JSON.stringify(await f.call(JSON.parse(functionCall.arguments)));
      logger.info(`Assistant called function: ${f.definition.name}(${functionCall.arguments}) => ${returnObject}`);
      return {
        role: 'function', 
        name: f.definition.name, 
        content: returnObject,
      };
    }
  }

  static async generateCode(messages: string[], model?: string, history?: ChatCompletionMessageParam[], functions?: Function[], includeSystemMessages: boolean = true, omitUsageData = false) {
    const systemMessages: ChatCompletionMessageParam[] = [
      { role: 'system', content: 'Return only the code and exclude example usage, markdown, explanations, comments and notes.' },
      { role: 'system', content: `Write code in typescript.` },
      { role: 'system', content: `Declare explicit types for all function parameters.` },
      { role: 'system', content: 'Export all functions and objects generated.' },
      { role: 'system', content: 'Do not omit function implementations.' },
    ];
    const resolvedHistory = history ? 
      includeSystemMessages ?
        history.concat(systemMessages)
        :
        history
      :
      includeSystemMessages ?
        systemMessages
        :
        undefined
    ;
    const code = await this.generateResponse(messages, model, resolvedHistory, functions, omitUsageData);
    return this.parseCodeFromMarkdown(code);
  }

  static async updateCode(code: string, description: string, model?: string, history?: ChatCompletionMessageParam[], functions?: Function[], includeSystemMessages: boolean = true, omitUsageData = false) {
    return await this.generateCode([this.updateCodeDescription(code, description)], model, history, functions, includeSystemMessages, omitUsageData);
  }

  static updateCodeDescription(code: string, description: string) {
    return `Update this code:\n\n${code}\n\n${description}`;
  }

  static parseCodeFromMarkdown(code: string) {
    if (!code.match(/```([\s\S]+?)```/g))
      return code;

    const filteredLines: string[] = [];
    let inCodeBlock = false;
    for (let line of code.split('\n')) {
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (!inCodeBlock)
          filteredLines.push('');
          
        continue;
      }

      if (inCodeBlock)
        filteredLines.push(line);
    }

    // remove the last '' that will become a \n
    // we only want spaces between code blocks
    filteredLines.pop();

    return filteredLines.join('\n');
  }

  static async generateList(messages: string[], model?: string, history?: ChatCompletionMessageParam[], functions?: Function[], includeSystemMessages: boolean = true, omitUsageData = false): Promise<string[]> {
    const systemMessages: ChatCompletionMessageParam[] = [
      { role: 'system', content: 'Return only the list and exclude example usage, markdown and all explanations, comments and notes.' },
      { role: 'system', content: 'Separate each item in the list by a ;' },
    ];
    const resolvedHistory = history ? 
      includeSystemMessages ?
        history.concat(systemMessages)
        :
        history
      :
      includeSystemMessages ?
        systemMessages
        :
        undefined
    ;
    const list = await this.generateResponse(messages, model, resolvedHistory, functions, omitUsageData);
    return list.split(';').map(item => item.trim());
  }
}