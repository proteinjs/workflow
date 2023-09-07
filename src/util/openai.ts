import { OpenAI } from "openai";
import { CodeGeneratorConfig } from "./CodeGeneratorConfig";

export async function generateCode(description: string) {
  const openai = new OpenAI();
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      { role: 'system', content: 'Return only the code and exclude example usage, markdown and all explanations, comments and notes.' },
      { role: 'system', content: `Write code in ${CodeGeneratorConfig.get().language?.name}.` },
      { role: 'system', content: 'Export all objects generated.' },
      { role: 'user', content: description }
    ],
  });
  const code = response.choices[0].message.content;
  if (!code) {
    console.log(`Received response: ${JSON.stringify(response)}`);
    throw new Error(`Unable to generate code from description: ${description}`);
  }

  return parseCodeFromMarkdown(code);
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
  const list = response.choices[0].message.content;
  if (!list) {
    console.log(`Received response: ${JSON.stringify(response)}`);
    throw new Error(`Unable to generate list from description: ${description}`);
  }

  return list.split(';').map(item => item.trim());
}