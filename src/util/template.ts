import path from 'path';
import fs from 'fs-extra';
import openai from './openai';
import { Logger } from './logger';
import { cmd } from './cmd';

type File = {
  path: string,
  content: string,
}

export type TemplateArgs = {
  srcPath: string,
}

export abstract class Template {
  protected logger = new Logger(this.constructor.name);
  protected templateArgs: TemplateArgs;

  constructor(templateArgs: TemplateArgs) {
    this.templateArgs = templateArgs;
  }

  abstract files(): any;
  apiDescriptions(): any { return {}; }

  abstract generate(args: any): Promise<void>;

  protected async generateCode(description: string, model?: string) {
    this.logger.info(`Generating code for description: ${description}`);
    const code = await openai.generateCode(description, model);
    this.logger.info(`Generated code:\n${code.slice(0, 150)}${code.length > 150 ? '...' : ''}`);
    return code;
  }

  protected async updateCode(codeToUpdateFilePath: string, dependencyCodeFilePaths: string[], description: string, model?: string) {
    const codeToUpdate = await this.readFile(codeToUpdateFilePath);
    let dependencyDescription = `Assume the following exists:\n`;
    for (let dependencyCodeFilePath of dependencyCodeFilePaths) {
      const dependencCode = await this.readFile(dependencyCodeFilePath);
      dependencyDescription += dependencCode + '\n\n';
    }

    this.logger.info(`Updating code: ${codeToUpdateFilePath}, with description: ${description}`);
    const updatedCode = await openai.updateCode(codeToUpdate, dependencyDescription + description, model);
    this.logger.info(`Updated code:\n${codeToUpdate.slice(0, 150)}${codeToUpdate.length > 150 ? '...' : ''}`);
    return updatedCode;
  }

  protected async readFile(filePath: string) {
    if (!await fs.exists(filePath))
      throw new Error(`File does not exist at path: ${filePath}`);
    
    const fileContent = (await fs.readFile(filePath)).toString();
    if (!fileContent)
      throw new Error(`File is empty: ${filePath}`);

    return fileContent;
  }

  protected async writeFiles(files: File[]) {
    for (let file of files) {
      await fs.ensureFile(file.path);
      this.logger.info(`Writing file: ${file.path}`);
      await fs.writeFile(file.path, file.content);
      this.logger.info(`Wrote file: ${file.path}`);
    }
  }

  protected filePath(relativePath: string) {
    const directory = this.templateArgs.srcPath;
    if (relativePath.includes('..'))
        throw new Error(`Failed to access file: ${relativePath}, file path cannot contain '..'`);

      return path.join(directory, this.constructor.name.toLocaleLowerCase(), relativePath);
  }

  protected relativePath(fromRelativePath: string, toRelativePath: string) {
    return path.join(path.relative(path.parse(fromRelativePath).dir, path.parse(toRelativePath).dir), path.parse(toRelativePath).name);
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
      const command = 'npm ' + args.join(' ');
      this.logger.info(`Running command: ${command}`);
      await cmd('npm', args);
      this.logger.info(`Ran command: ${command}`);
    }
  }
}