import fs from 'fs-extra';
import path from 'path';
import * as readline from 'readline-sync';
import { cmd } from '@brentbahry/util';
import { Conversation } from './Conversation';
import { OpenAi } from './OpenAi';
import { Repo } from './Repo2';
import { PackageUtilFunctions } from './functions/PackageUtilFunctions';
import { FsFunctions } from './functions/FsFunctions';
import { searchFilesFunction } from './functions/RepoFunctions';
import { ConversationTemplateRepoFactory } from './conversation_templates/ConversationTemplateRepo';
import { getConversationTemplateFunction, searchConversationTemplatesFunction } from './functions/ConversationTemplateRepoFunctions';

export class CodegenConversation {
  private static INITIAL_QUESTION = 'What would you like to create?';
  private static CODE_RESPONSE = 'Code with user input:';
  private static BOT_NAME = 'Alina';
  private static MODEL = 'gpt-4';
  private conversation = new Conversation({ conversationName: this.constructor.name, logLevel: 'info' });
  private repo: Repo;
  private conversationTemplateRepo = new ConversationTemplateRepoFactory().create();

  constructor(repo: Repo) {
    this.repo = repo;
  }

  async start() {
    this.loadSystemMessages();
    this.loadFunctions();
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
      `Assume the current working directory is: ${this.repo.params.dir} unless specified by the user`,
      `Pre-pend the current working directory as the base path to filePaths when performing file operations, unless specified otherwise by the user`,
      `If they want to create a function/class/object using an API we are familiar with, we will ask the user for the required information to fill in all mandatory parameters and ask them if they want to provide optional parameter values`,
      `Once we have gotten the values for all parameters, respond with '${CodegenConversation.CODE_RESPONSE}' followed by the code to instantiate/call the function/class/object with the user's responses for parameter values`,
      `If the code we generate returns a promise, make sure we await it`,
      `You have access to code in a private repo, you can read and write code to and from the file system`,
      `If the user wants to generate code, identify files that may contain libraries to use from this repo, and access either their content or their typescript declarations via the available functions, whichever is needed for code generation`,
      `If using one of the repo apis, import the api from its corresponding package when generating code that uses that api`,
      `If you're generating a call to a class that extends Template, require that the user provide Template's constructor parameters as well and combine them into the parameters passed into the base class you're instantiating`,
      `Make sure you ask for a srcPath and pass that in to the Template base class constructor arg`,
      `Surround generated code (not including imports) with a self-executing, anonymous async function like this (async function() =>{})()`,
      ...this.conversationTemplateRepo.getSystemMessages(),
    ];
    this.conversation.addSystemMessagesToHistory(systemMessages);
  }

  private loadFunctions() {
    this.conversation.addFunctions([
      ...FsFunctions, 
      ...PackageUtilFunctions, 
      searchFilesFunction(this.repo), 
      searchConversationTemplatesFunction(this.conversationTemplateRepo), 
      getConversationTemplateFunction(this.conversationTemplateRepo),
    ]);
  }

  private respondToUser(message: string) {
    return readline.question(`[${CodegenConversation.BOT_NAME}] ${message}\n`);
  }

  private async generateCode(message: string) {
    const code = OpenAi.parseCodeFromMarkdown(message);
    const srcPathToken = 'TOKEN';
    const responseSrcPath = await this.conversation.generateResponse([`Return the srcPath the user provided surrounded by the token ${srcPathToken}`], CodegenConversation.MODEL);
    const srcPath = responseSrcPath.replace(/["'`]/g, '').match(/TOKEN(.*?)TOKEN/)?.[1];
    if (!srcPath)
      throw new Error(`Failed to parse responseSrcPath: ${responseSrcPath}`);
    const codePath = path.join(process.cwd(), srcPath, 'template.ts');
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