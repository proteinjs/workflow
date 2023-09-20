import fs from 'fs-extra';
import path from 'path';
import * as readline from 'readline-sync';
import { Fs, cmd } from '@brentbahry/util';
import { Conversation } from './Conversation';
import { OpenAi } from './OpenAi';
import { Repo } from './Repo';

export class CodegenConversation {
  private static INITIAL_QUESTION = 'What would you like to create?';
  private static CODE_RESPONSE = 'Code with user input:';
  private static BOT_NAME = 'Alina';
  private static MODEL = 'gpt-4';
  private conversation = new Conversation({ conversationName: this.constructor.name, logLevel: 'error' });
  private repo: Repo;

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
      `If they want to create a function/class/object using an API we are familiar with, we will ask the user for the required information to fill in all mandatory parameters and ask them if they want to provide optional parameter values`,
      `Once we have gotten the values for all parameters, respond with '${CodegenConversation.CODE_RESPONSE}' followed by the code to instantiate/call the function/class/object with the user's responses for parameter values`,
      `If the code we generate returns a promise, make sure we await it`,
      `You have access to code in a private repo, you can read and write code to and from the file system`,
      // `To find code corresponding to a user request, start by calling the searchFiles function`,
      `If the user wants to generate code, identify files that may contain libraries to use from this repo, and access either their content or their typescript declarations via the available functions, whichever is needed for code generation`,
      // `Favor calling getDeclarations over readFiles if full file content is not needed`,
      // `If the user provides a file path and it does not have a file extension, use searchFiles to find valid file path options`,
      // `Only call functions that take in filePaths with valid file paths, if you don't know the valid file path try and search for it by keyword with the searchFiles function`,
      `If using one of the repo apis, import the api from its corresponding package when generating code that uses that api`,
      `If you're generating a call to a class that extends Template, require that the user provide Template's constructor parameters as well and combine them into the parameters passed into the base class you're instantiating`,
      `Make sure you ask for a srcPath and pass that in to the Template base class constructor arg`,
      `Surround generated code (not including imports) with a self-executing, anonymous async function like this (async function() =>{})()`,
    ];
    this.conversation.addSystemMessagesToHistory(systemMessages);
  }

  private loadFunctions() {
    this.conversation.addFunctions([
      {
        definition: {
          name: 'readFiles',
          description: 'Get the content of files',
          parameters: {
            type: 'object',
            properties: {
              filePaths: {
                type: 'array',
                description: 'Paths to the files',
                items: {
                  type: 'string',
                },
              },
            },
            required: ['filePaths']
          },
        },
        call: Fs.readFiles,
      },
      {
        definition: {
          name: 'writeFiles',
          description: 'Write files to the file system',
          parameters: {
            type: 'object',
            properties: {
              files: {
                type: 'array',
                description: 'Files to write',
                items: {
                  type: 'object',
                  properties: {
                    path: {
                      type: 'string',
                      description: 'the file path',
                    },
                    content: {
                      type: 'string',
                      description: 'the content to write to the file',
                    },
                  },
                },
              },
            },
            required: ['files']
          },
        },
        call: Fs.writeFiles,
        instructions: [
          `If the user has asked to update a file, do not write to the file if it does not already exist`
        ],
      },
      {
        definition: {
          name: 'getDeclarations',
          description: 'Get the typescript declarations of files',
          parameters: {
            type: 'object',
            properties: {
              tsFilePaths: {
                type: 'array',
                description: 'Paths to the files',
                items: {
                  type: 'string',
                },
              },
              includeDependencyDeclarations: {
                type: 'boolean',
                description: 'if true, returns declarations for input tsFilePaths and all dependencies. defaults to false.'
              },
            },
            required: ['tsFilePaths']
          },
        },
        call: async (params: { tsFilePaths: string[] }) => this.repo.getDeclarations(params),
        instructions: [
          `Favor calling getDeclarations over readFiles if full file content is not needed`,
        ],
      },
      {
        definition: {
          name: 'searchFiles',
          description: 'Get file paths to files that contain keyword',
          parameters: {
            type: 'object',
            properties: {
              keyword: {
                type: 'string',
                description: 'Search files for this keyword'
              },
            },
            required: ['keyword']
          },
        },
        call: async (params: { keyword: string }) => this.repo.searchFiles(params),
        instructions: [
          `If the user is trying to interact with a file, but does not provide a path, you can find file paths that match a keyword using searchFiles`,
          `Only call functions that take in filePaths with valid file paths, if you don't know the valid file path try and search for it by keyword with the searchFiles function`,
          `If the user references a file in a package without providing a path, use searchFiles on the keyword to find potentially relevant files, and choose the one that references the package name in its path`,
        ],
      },
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