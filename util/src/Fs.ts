import path from 'path';
import fsExtra from 'fs-extra';
import { Logger } from './Logger';

export type File = {
  path: string,
  content: string,
}

export class Fs {
  private static LOGGER = new Logger('Fs');

  static async readFile(filePath: string) {
    if (!await fsExtra.exists(filePath))
      throw new Error(`File does not exist at path: ${filePath}`);
    
    const fileContent = (await fsExtra.readFile(filePath)).toString();
    if (!fileContent)
      throw new Error(`File is empty: ${filePath}`);

    return fileContent;
  }

  static async writeFiles(files: File[]) {
    for (let file of files) {
      await fsExtra.ensureFile(file.path);
      Fs.LOGGER.info(`Writing file: ${file.path}`);
      await fsExtra.writeFile(file.path, file.content);
      Fs.LOGGER.info(`Wrote file: ${file.path}`);
    }
  }

  /** Produces a join only if the relative path does not escape the base path */
  static baseContainedJoin(basePath: string, relativePath: string) {
    if (relativePath.includes('..'))
        throw new Error(`Failed to access file: ${relativePath}, file path cannot contain '..'`);

      return path.join(basePath, relativePath);
  }

  static relativeFilePath(fromRelativePath: string, toRelativePath: string) {
    return path.join(
      path.relative(
        path.parse(fromRelativePath).dir, path.parse(toRelativePath).dir
      ),
      path.parse(toRelativePath).name
    );
  }
}