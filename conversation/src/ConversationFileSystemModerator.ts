import { FileContentMap, LogLevel, Logger } from '@brentbahry/util';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { MessageModerator } from './MessageModerator';

export interface ConversationFileSystem {
  fileContentMap: FileContentMap;
  order: string[]; // ordered list of filePaths
}

export interface ConversationFileSystemFactoryParams {
  maxFiles: number;
  logLevel: LogLevel;
}

export class ConversationFileSystemFactory {
  private logger: Logger;
  private params: ConversationFileSystemFactoryParams;

  constructor(params?: Partial<ConversationFileSystemFactoryParams>) {
    this.params = Object.assign({ maxFiles: 10, logLevel: 'info' }, params);
    this.logger = new Logger(this.constructor.name, this.params.logLevel);
  }

  merge(existingFs: ConversationFileSystem, updates: FileContentMap): ConversationFileSystem {
    for (let filePath of Object.keys(updates)) {
      // if the file already exists in the fs
      if (existingFs.fileContentMap[filePath]) {
        this.logger.debug(`Updating existing file: ${filePath}`)
        existingFs.fileContentMap[filePath] = updates[filePath];
        const oldIndex = existingFs.order.findIndex(item => item == filePath);
        existingFs.order.splice(oldIndex, 1);
        existingFs.order.push(filePath);
        continue;
      }

      // if we have less than the max number of files in the fs
      if (Object.keys(existingFs.fileContentMap).length < this.params.maxFiles) {
        this.logger.debug(`Adding new file (under limit): ${filePath}`)
        existingFs.fileContentMap[filePath] = updates[filePath];
        existingFs.order.push(filePath);
        continue;
      } else {
        this.logger.debug(`Adding new file (over limit): ${filePath}`)
        const removedFilePath = existingFs.order.splice(0, 1)[0];
        delete existingFs.fileContentMap[removedFilePath];
        existingFs.fileContentMap[filePath] = updates[filePath];
        existingFs.order.push(filePath);
      }
    }

    return existingFs;
  }
}

export class ConversationFileSystemModerator implements MessageModerator {
  private logLevel: LogLevel = 'info';

  constructor(logLevel?: LogLevel) {
    if (logLevel)
      this.logLevel = logLevel;
  }

  observe(messages: ChatCompletionMessageParam[]): ChatCompletionMessageParam[] {
    let conversationFileSystemMessageIndex: number = -1;
    let conversationFileSystem: ConversationFileSystem|undefined;
    let readFilesFunctionCallMessageIndexes: number[] = [];
    const readFilesConsolidatedOutput: FileContentMap = {}; // newest version of file wins
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (message.role == 'system' && message.content) {
        let parsedContent: any;
        try {
          parsedContent = JSON.parse(message.content);
        } catch (error) {}
        if (!parsedContent || !parsedContent['fileSystem'])
          continue;

        conversationFileSystem = parsedContent['fileSystem'];
        conversationFileSystemMessageIndex = i;
        continue;
      }

      if (message.role == 'function' && message.name == 'readFiles' && message.content) {
        let parsedContent: any|undefined;
        try {
          parsedContent = JSON.parse(message.content);
        } catch (error) {}
        if (!parsedContent)
          continue;

        for (let filePath of Object.keys(parsedContent)) {
          readFilesConsolidatedOutput[filePath] = parsedContent[filePath];
        }

        readFilesFunctionCallMessageIndexes.push(i);
      }
    }

    if (conversationFileSystem) {
      conversationFileSystem = new ConversationFileSystemFactory({ logLevel: this.logLevel }).merge(conversationFileSystem, readFilesConsolidatedOutput);
      const content = JSON.stringify({ fileSystem: conversationFileSystem });
      messages[conversationFileSystemMessageIndex].content = content;
    } else {
      conversationFileSystem = { fileContentMap: readFilesConsolidatedOutput, order: Object.keys(readFilesConsolidatedOutput) };
      messages.push({ role: 'system', content: `Whenever you make a call to readFiles, the file content will be loaded into the { fileSystem } object in the message history` });
      const content = JSON.stringify({ fileSystem: conversationFileSystem });
      messages.push({ role: 'system', content });
    }

    const moderatedMessages = messages
      .filter((message, i) => !readFilesFunctionCallMessageIndexes.includes(i))
    ;
    return moderatedMessages;
  }
}