import { OpenAI } from 'openai';
import { Logger } from './logger';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

export = openai;

namespace openai {
export async function generateResponse(message: string, model?: string, history?: ChatCompletionMessageParam[], omitUsageData = false) {
  const logger = new Logger('generateResponse');
  const openai = new OpenAI();
  const descriptionMessageParam: ChatCompletionMessageParam = { role: 'user', content: message };
  if (history)
    history.push(descriptionMessageParam);
  const messages = history ? history : [descriptionMessageParam];
  const response = await openai.chat.completions.create({
    model: model ? model : 'gpt-3.5-turbo',
    temperature: 0,
    messages,
  });

  if (!omitUsageData) {
    if (response.usage)
      logger.info(JSON.stringify(response.usage));
    else
      logger.info(JSON.stringify(`Usage data missing`));
  }

  const responseText = response.choices[0].message.content;
  if (!responseText) {
    logger.error(`Received response: ${JSON.stringify(response)}`);
    throw new Error(`Response was empty for description: ${message}`);
  }

  return responseText;
}

export async function generateCode(description: string, model?: string, history?: ChatCompletionMessageParam[], includeSystemMessages: boolean = true, omitUsageData = false) {
  const systemMessages: ChatCompletionMessageParam[] = [
    { role: 'system', content: 'Return only the code and exclude example usage, markdown, explanations, comments and notes.' },
    { role: 'system', content: `Write code in typescript.` },
    { role: 'system', content: `Declare explicit types for all function parameters.` },
    { role: 'system', content: 'Export all functions and objects generated.' },
    { role: 'system', content: 'Exclude unused imports.' },
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
  const code = await generateResponse(description, model, resolvedHistory, omitUsageData);
  return parseCodeFromMarkdown(code);
}

export async function updateCode(code: string, description: string, model?: string, history?: ChatCompletionMessageParam[], includeSystemMessages: boolean = true, omitUsageData = false) {
  return await generateCode(updateCodeDescription(code, description), model, history, includeSystemMessages, omitUsageData);
}

export function updateCodeDescription(code: string, description: string) {
  return `Update this code:\n\n${code}\n\n${description}`;
}

export function parseCodeFromMarkdown(code: string) {
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

export async function generateList(description: string, model?: string, history?: ChatCompletionMessageParam[], includeSystemMessages: boolean = true, omitUsageData = false): Promise<string[]> {
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
  const list = await generateResponse(description, model, resolvedHistory, omitUsageData);
  return list.split(';').map(item => item.trim());
}
}