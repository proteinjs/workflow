import path from 'path';
import fs from 'fs-extra';
import * as ChildProcess from 'child_process';
import { CodeGeneratorConfig } from './CodeGeneratorConfig';
import { generateCode, updateCode } from "./openai";
import { Logger } from './logger';

type File = {
  relativePath: string,
  content: string,
}

export abstract class Template {
  protected logger = new Logger(this.constructor.name);

  abstract files(): any;

  abstract generate(args: any): Promise<void>;

  protected async generateCode(description: string) {
    this.logger.info(`Generating code for description: ${description}`);
    const code = await generateCode(description);
    this.logger.info(`Generated code:\n${code.slice(0, 150)}${code.length > 150 ? '...' : ''}`);
    return code;
  }

  protected async updateCode(relativePath: string, description: string) {
    const filePath = this.filePath(relativePath);
    if (!await fs.exists(filePath))
      throw new Error(`File does not exist at path: ${filePath}`);
    
    const code = (await fs.readFile(filePath)).toString();
    if (!code)
      throw new Error(`File is empty: ${filePath}`);
  
    this.logger.info(`Updating code: ${filePath}, with description: ${description}`);
    const updatedCode = await updateCode(code, description);
    this.logger.info(`Updated code:\n${code.slice(0, 150)}${code.length > 150 ? '...' : ''}`);
    return updatedCode;
  }

  protected async writeFiles(files: File[]) {
    for (let file of files) {
      const filePath = this.filePath(file.relativePath);
      await fs.ensureFile(filePath);
      this.logger.info(`Writing file: ${filePath}`);
      await fs.writeFile(filePath, file.content);
      this.logger.info(`Wrote file: ${filePath}`);
    }
  }

  protected filePath(relativePath: string) {
    const directory = CodeGeneratorConfig.get().srcPath;
    if (relativePath.includes('..'))
        throw new Error(`Failed to access file: ${relativePath}, file path cannot contain '..'`);

      return path.join(directory, this.constructor.name.toLocaleLowerCase(), relativePath);
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