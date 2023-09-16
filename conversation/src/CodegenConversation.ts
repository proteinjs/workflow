import fs from 'fs-extra';
import path from 'path';
import * as readline from 'readline-sync';
import { cmd } from '@brentbahry/util';
import { Conversation } from './Conversation';
import openai from './openai';
import { Repo } from './Repo';

export class CodegenConversation {
  private static INITIAL_QUESTION = 'What would you like to create?';
  private static CODE_RESPONSE = 'Code with user input:';
  private static BOT_NAME = 'Alina';
  private static MODEL = 'gpt-4';
  private conversation = new Conversation(true);
  private repo: Repo;

  constructor(repo: Repo) {
    this.repo = repo;
  }

  async start() {
    this.loadSystemMessages();
    this.conversation.addAssistantMessagesToHistory([CodegenConversation.INITIAL_QUESTION]);
    const initialUserInput = this.respondToUser(CodegenConversation.INITIAL_QUESTION);
    let response = await this.conversation.generateResponse([initialUserInput], CodegenConversation.MODEL);
    while (true) {
      const userInput = this.respondToUser(response);
      response = await this.conversation.generateResponse([userInput], CodegenConversation.MODEL);
      if (response.includes(CodegenConversation.CODE_RESPONSE))
        await this.generateCode(response);
    }
  }

  private loadSystemMessages() {
    const systemMessages = [
      `We are going to have a conversation with the user to generate code`,
      `If they want to create a function/class/object using an API we are familiar with, we will ask the user for the required information to fill in all mandatory parameters and ask them if they want to provide optional parameter values`,
      `Once we have gotten the values for all parameters, respond with '${CodegenConversation.CODE_RESPONSE}' followed by the code to instantiate/call the function/class/object with the user's responses for parameter values`,
      `If the code we generate returns a promise, make sure we await it`,
      `The following is code we should be able use for generation, if the user wants to create something that matches this code, use these apis:\n${JSON.stringify(this.repo.declarations)}`,
      `If using one of the included apis, import them from the 'conversation' package`,
      `If you're generating a call to a class that extends Template, require that the user provide Template's constructor parameters as well and combine them into the parameters passed into the base class you're instantiating`,
      `Make sure you ask for a srcPath and pass that in to the Template base class constructor arg`,
      `Surround generated code (not including imports) with a self-executing, anonymous async function like this (async function() =>{})()`,
      // `Combine whatever srcPath the user provides with ${process.cwd()}`
    ];
    this.conversation.addSystemMessagesToHistory(systemMessages);
  }

  private respondToUser(message: string) {
    return readline.question(`[${CodegenConversation.BOT_NAME}] ${message}\n`);
  }

  private async generateCode(message: string) {
    const code = openai.parseCodeFromMarkdown(message);
    const srcPathToken = 'TOKEN';
    const responseSrcPath = await this.conversation.generateResponse([`Return the srcPath the user provided surrounded by the token ${srcPathToken}`], CodegenConversation.MODEL);
    const srcPath = responseSrcPath.replace(/["'`]/g, '').match(/TOKEN(.*?)TOKEN/)?.[1];
    if (!srcPath)
      throw new Error(`Failed to parse responseSrcPath: ${responseSrcPath}`);
    const codePath = path.join(srcPath, 'template.ts');
    await fs.ensureFile(codePath);
    await fs.writeFile(codePath, code);
    console.log(`Wrote file: ${codePath}`);
    const command = 'node';
    const args = [codePath];
    const commandLog = `${command} ` + args.join(' ');
    console.info(`Running command: ${commandLog}`);
    await cmd(command, args, {OPENAI_API_KEY: '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'});
    console.info(`Ran command: ${commandLog}`);
    console.info(`Generated code from template: ${codePath}`);
  }
}