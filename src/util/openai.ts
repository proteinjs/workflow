import { OpenAI } from "openai";
import { CodeGeneratorConfig } from "./CodeGeneratorConfig";
import { Logger } from './logger';

export async function generateCode(description: string, model?: string) {
  const logger = new Logger('generateCode');
  const openai = new OpenAI();
  const response = await openai.chat.completions.create({
    model: model ? model : 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      { role: 'system', content: 'Return only the code and exclude example usage, markdown, explanations, comments and notes.' },
      { role: 'system', content: `Write code in ${CodeGeneratorConfig.get().language?.name}.` },
      { role: 'system', content: `Declare explicit types for all function parameters.` },
      { role: 'system', content: 'Export all functions and objects generated.' },
      { role: 'system', content: 'Exclude unused imports.' },
      { role: 'system', content: 'Do not omit function implementations.' },
      { role: 'user', content: description }
    ],
  });

  if (response.usage)
    logger.info(JSON.stringify(response.usage));
  else
    logger.info(JSON.stringify(`Usage data missing`));

  const code = response.choices[0].message.content;
  if (!code) {
    logger.error(`Received response: ${JSON.stringify(response)}`);
    throw new Error(`Unable to generate code from description: ${description}`);
  }

  return parseCodeFromMarkdown(code);
}

export async function updateCode(code: string, description: string, model?: string) {
  return await generateCode(`Update this code:\n\n${code}\n\n${description}`, model);
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

export async function generateList(description: string): Promise<string[]> {
  const logger = new Logger('generateList');
  const openai = new OpenAI();
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      { role: 'system', content: 'Return only the list and exclude example usage, markdown and all explanations, comments and notes.' },
      { role: 'system', content: 'Separate each item in the list by a ;' },
      { role: 'user', content: description }
    ],
  });
  if (response.usage)
    logger.info(JSON.stringify(response.usage));
  else
    logger.info(JSON.stringify(`Usage data missing`));

  const list = response.choices[0].message.content;
  if (!list) {
    console.log(`Received response: ${JSON.stringify(response)}`);
    throw new Error(`Unable to generate list from description: ${description}`);
  }

  return list.split(';').map(item => item.trim());
}