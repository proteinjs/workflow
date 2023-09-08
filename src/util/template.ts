import path from 'path';
import fs from 'fs-extra';
import * as ChildProcess from 'child_process';
import { CodeGeneratorConfig } from './CodeGeneratorConfig';
import { generateCode } from "./openai";
import { Logger } from './logger';

type File = {
  name: string,
  extension: string,
  relativePath?: string,
  content: string,
}

export abstract class Template {
  protected logger = new Logger(this.constructor.name);

  abstract generate(args: any): Promise<void>;

  protected async generateCode(description: string) {
    this.logger.info(`Generating code for description: ${description}`);
    const code = await generateCode(description);
    this.logger.info(`Generated code:\n${code.slice(0, 150)}${code.length > 150 ? '...' : ''}`);
    return code;
  }

  protected async writeFiles(files: File[]) {
    const directory = CodeGeneratorConfig.get().srcPath;
    for (let file of files) {
      const relativeFilePath = this.relativeFilePath(file.name, file.extension, file.relativePath?.toLocaleLowerCase());
      if (file.relativePath && file.relativePath.includes('..'))
        throw new Error(`Failed to write file: ${relativeFilePath}, file path cannot contain '..'`);

      const filePath = this.filePath(directory, relativeFilePath);
      await fs.ensureFile(filePath);
      this.logger.info(`Writing file: ${filePath}`);
      await fs.writeFile(filePath, file.content);
      this.logger.info(`Wrote file: ${filePath}`);
    }
  }

  private relativeFilePath(fileName: string, fileExtension: string, fileRelativePath?: string) {
    if (!fileExtension.startsWith('.'))
      fileExtension = '.' + fileExtension;
    
    if (!fileRelativePath)
      return fileName+fileExtension;
    
    let resolvedPath = fileRelativePath;
    if (resolvedPath.startsWith(path.sep))
      resolvedPath = resolvedPath.slice(1);
    
    if (!resolvedPath.endsWith(path.sep))
      resolvedPath += path.sep;

    return resolvedPath + fileName + fileExtension;
  }

  private filePath(directory: string, relativeFilePath: string) {
    if (directory.endsWith(path.sep))
      return directory + relativeFilePath;

    return directory + path.sep + relativeFilePath;
  }

  protected async installPackage(packages: { name: string, version?: string, exactVersion?: boolean, development?: boolean }[]) {
    for (let backage of packages) {
      const { name, version, exactVersion, development } = backage;
      const resolvedExactVersion = typeof exactVersion === 'undefined' ? true : exactVersion;
      const resolvedDevelopment = typeof development === 'undefined' ? false : development;
      const args = [
        'i',
        `${resolvedDevelopment ? `-D` : resolvedExactVersion ? '--save-exact' : `-S`}`,
        `${name}${version ? `@${version}` : ''}`
      ];
      const cmd = 'npm ' + args.join(' ');
      this.logger.info(`Running command: ${cmd}`);
      await this.cmd('npm', args);
      this.logger.info(`Ran command: ${cmd}`);
    }
  }

  private async cmd(command: string, options?: string[]) {
    let p = ChildProcess.spawn(command, options, {
      cwd: process.cwd()
    });
    return new Promise((resolve) => {
      p.stdout.on('data', (x: any) => {
        process.stdout.write(x.toString());
      });
      p.stderr.on('data', (x) => {
        process.stderr.write(x.toString());
      });
      p.on('error', (error) => {
        process.stderr.write(error.toString());
      });
      p.on('exit', (code) => {
        resolve(code);
      });
    });
  }
}