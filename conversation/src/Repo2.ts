import { FileDescriptor, Fs, Logger } from '@brentbahry/util';
import fs from 'fs/promises';
import path from 'path';
import ts from 'typescript';
import { createKeywordFilesIndex } from './createKeywordFilesIndex';

export type RepoParams = {
  keywordFilesIndex: { [keyword: string]: string[] /** file paths */ },
}

export class Repo {
  private logger = new Logger(this.constructor.name);
  params: RepoParams;

  constructor(params: RepoParams) {
    this.params = params;
  }

  keywordFilesIndex() {
    return this.params.keywordFilesIndex;
  }

  searchFiles(params: { keyword: string }) {
    this.logger.info(`Searching for file, keyword: ${params.keyword}`);
    const filePaths = this.keywordFilesIndex()[params.keyword];
    return filePaths || [];
  }
}

export class RepoFactory {
  private static LOGGER = new Logger('RepoFactory');

  public static async createRepo(dir: string): Promise<Repo> {
    this.LOGGER.info(`Creating repo for dir: ${dir}`);
    let repoParams: RepoParams = { keywordFilesIndex: {} };
    repoParams.keywordFilesIndex = await createKeywordFilesIndex(dir, ['**/node-typescript-parser/**']);
    this.LOGGER.info(`Created repo for dir: ${dir}`);
    return new Repo(repoParams);
  }
}
