import path from 'path';
import fsExtra from 'fs-extra';
import { Logger } from './Logger';

export type File = {
  path: string,
  content: string,
}

export interface FileDescriptor {
    name: string;
    nameWithoutExtension: string;
    path: string;
    projectRelativePath: string;
}

export class Fs {
  private static LOGGER = new Logger('Fs');

  static async readFiles(params: { filePaths: string[] }) {
    const fileMap: {[filePath: string]: string} = {};
    for (let filePath of params.filePaths) {
      fileMap[filePath] = await this.readFile(filePath);
    }
    return fileMap;
  }

  static async readFile(filePath: string) {
    if (!await fsExtra.exists(filePath))
      throw new Error(`File does not exist at path: ${filePath}`);
    
    const fileContent = (await fsExtra.readFile(filePath)).toString();
    if (!fileContent)
      throw new Error(`File is empty: ${filePath}`);

    Fs.LOGGER.info(`Read file: ${filePath}`);
    return fileContent;
  }

  static async writeFiles(params: { files: File[] }) {
    for (let file of params.files) {
      await fsExtra.ensureFile(file.path);
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

  static async getFilesInDirectory(dir: string, excludedDirs?: string[], rootDir?: string,): Promise<FileDescriptor[]> {
    let results: FileDescriptor[] = [];
    if (!rootDir)
      rootDir = dir;

    const dirents = await fsExtra.readdir(dir, { withFileTypes: true });

    for (const dirent of dirents) {
        const fullPath = path.resolve(dir, dirent.name);

        if (dirent.isDirectory()) {
            if (excludedDirs && !excludedDirs.includes(dirent.name)) {
                results = results.concat(await this.getFilesInDirectory(fullPath, excludedDirs, rootDir));
            }
        } else {
            const fileDescriptor: FileDescriptor = {
                name: dirent.name,
                nameWithoutExtension: path.parse(dirent.name).name,
                path: fullPath,
                projectRelativePath: path.relative(rootDir, fullPath)
            };
            results.push(fileDescriptor);
        }
    }

    return results;
  }
}