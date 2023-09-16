import path from 'path';
import fs from 'fs-extra';
import openai from './openai';
import { Logger, cmd } from '@brentbahry/util';
import { RepoFactory } from './Repo';
import { Conversation } from './Conversation';

type File = {
  path: string,
  content: string,
}

export type Dependency = { 
  moduleNames: string[], 
  importPathFromGeneratedFile: string, 
  filePath: string,
}

export type Package = { 
  name: string, 
  version?: string, 
  exactVersion?: boolean, 
  development?: boolean 
}

export type TemplateArgs = {
  srcPath: string,
}

export abstract class Template {
  protected logger = new Logger(this.constructor.name);
  private conversation = new Conversation();
  protected templateArgs: TemplateArgs;
  private packages: Package[] = [];
  private dependencies: Dependency[] = [];

  constructor(templateArgs: TemplateArgs) {
    this.templateArgs = templateArgs;
  }

  abstract getFilePaths(): any;
  apiDescriptions(): any { return {}; }

  abstract generate(args: any): Promise<void>;

  protected addDependencies(dependencies: Dependency[]) {
    this.dependencies.push(...dependencies);
    this.conversation.addSystemMessagesToHistory([
      this.declarationMessage(dependencies.map(d => d.filePath)),
      this.importMessage(dependencies),
    ]);
  }

  private declarationMessage(tsFilePaths: string[]) {
    const declarationMap = RepoFactory.generateDeclarations(tsFilePaths);
    const declarations = Object.values(declarationMap).join('\n');
    return `Assume the following code exists in other files:\n${declarations}`;
  }

  private importMessage(imports: Omit<Dependency, 'filePath'>[]) {
    const importStatements = imports.map(i => `import { ${i.moduleNames.join(', ')} } from '${i.importPathFromGeneratedFile}'`);
    return `Add the following imports:\n${importStatements}`;
  }

  protected async installPackages(packages: Package[]) {
    this.packages.push(...packages);
    for (let backage of this.packages) {
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

  protected async generateCode(description: string[], model?: string) {
    this.logger.info(`Generating code for description:\n${description.join('\n')}`);
    const code = await this.conversation.generateCode(description, model);
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
    const updatedCode = await this.conversation.updateCode(codeToUpdate, dependencyDescription + description, model);
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

      return path.join(directory, relativePath);
  }

  protected relativePath(fromRelativePath: string, toRelativePath: string) {
    return path.join(path.relative(path.parse(fromRelativePath).dir, path.parse(toRelativePath).dir), path.parse(toRelativePath).name);
  }
}