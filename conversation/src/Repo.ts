import { FileDescriptor, Fs, Logger } from '@brentbahry/util';
import fs from 'fs/promises';
import path from 'path';
import ts from 'typescript';

export interface TsFile extends FileDescriptor {
  declaration: string;
}

export interface PackageInfo {
  packageJSON: any;  // The content of the package.json
  dirPath: string;
  tsFiles: { [tsFilePath: string]: TsFile };
  fileDescriptors: FileDescriptor[];
}

export type SlimPackageInfo = Omit<PackageInfo, 'packageJSON'|'tsFiles'>;

export type RepoParams = {
  packages: Record<string, PackageInfo>,
  slimPackages: Record<string, SlimPackageInfo>,
  tsFiles: { [tsFilePath: string]: TsFile },
}

export class Repo {
  private logger = new Logger(this.constructor.name);
  params: RepoParams;

  constructor(params: RepoParams) {
    this.params = params;
  }

  packages() {
    return this.params.packages;
  }

  slimPackages() {
    return this.params.slimPackages;
  }

  tsFiles() {
    return this.params.tsFiles;
  }

  getDeclarations(params: { tsFilePaths: string[] }) {
    const queriedDeclarations: { [tsFilePath: string]: string } = {};
    for (let tsFilePath of params.tsFilePaths) {
      queriedDeclarations[tsFilePath] = this.params.tsFiles[tsFilePath].declaration;
      this.logger.info(`Accessed declaration: ${tsFilePath}`);
    }
    return queriedDeclarations;
  }

  static generateDeclarations(params: { tsFilePaths: string[], includeDependencyDeclarations?: boolean }): {[tsFilePath: string]: string} {
    // declarations for this file and its local dependencies
    const declarations: {[filePath: string]: string} = {};

    // Create a Program from a root file name.
    const program = ts.createProgram(params.tsFilePaths, {
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      declaration: true,  // This is what makes the magic happen.
      emitDeclarationOnly: true,
    });

    // Create a custom emit writer that writes to our variable.
    const customWriteFile: ts.WriteFileCallback = (fileName, data) => {
      if (fileName.endsWith('.d.ts')) {
        const tsFileName = fileName.slice(0, fileName.indexOf('.d.ts')) + '.ts';
        declarations[tsFileName] = data;
      }
    };

    // Generate the declaration content.
    if (params.includeDependencyDeclarations) {
      const result = program.emit(undefined, customWriteFile, undefined, true);
      this.logCompilerErrors(result);
    } else {
      for (let tsFilePath of params.tsFilePaths) {
        const sourceFile = program.getSourceFile(tsFilePath);
        const result = program.emit(sourceFile, customWriteFile, undefined, true);
        this.logCompilerErrors(result);
      }
    }

    return declarations;
  }

  private static logCompilerErrors(result: ts.EmitResult) {
    if (result.emitSkipped || result.diagnostics.length > 0) {
      // Log errors if there were any.
      result.diagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
          const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
          const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
          console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
          console.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
        }
      });
    }
  }
}

export class RepoFactory {
  public static async createRepo(dir: string): Promise<Repo> {
    let repoParams: RepoParams = { packages: {}, slimPackages: {}, tsFiles: {} };

    async function traverse(dir: string) {
      const childrenNames = await fs.readdir(dir, { withFileTypes: true });
      let hasPackageJson = childrenNames.some(dirent => dirent.name === 'package.json');
      if (hasPackageJson) {
        const packageContent = await fs.readFile(path.join(dir, 'package.json'), 'utf-8');
        const packageJSON = JSON.parse(packageContent);
        repoParams.packages[packageJSON.name] = { 
          packageJSON: packageJSON,
          tsFiles: {},
          fileDescriptors: [],
          dirPath: dir,
        };
      }
      
      for (const dirent of childrenNames) {
        if (!dirent.isDirectory())
          continue;

        // Exclude directories 'node_modules' and 'dist' right at the beginning
        if (dirent.name.includes('node_modules') || dirent.name.includes('dist')) {
          continue;
        }

        // Continue with the traversal if it's a directory
        const childPath = path.join(dir, dirent.name);
        await traverse(childPath);
      }
    }

    await traverse(dir);
    await this.loadFiles(repoParams);
    Object.keys(repoParams.packages).forEach(packageName => {
      const { packageJSON, tsFiles, ...slimPackage } = repoParams.packages[packageName];
      repoParams.slimPackages[packageName] = slimPackage;
    })
    return new Repo(repoParams);
  }

  private static async loadFiles(repoParams: RepoParams) {
    for (let packageName of Object.keys(repoParams.packages)) {
      const dirPath = repoParams.packages[packageName].dirPath;
      if (dirPath) {
        repoParams.packages[packageName].fileDescriptors.push(...await Fs.getFilesInDirectory(dirPath, ['node_modules', 'dist']));
        for (let fileDescriptor of repoParams.packages[packageName].fileDescriptors) {
          const typescriptDeclaration = Repo.generateDeclarations({ tsFilePaths: [fileDescriptor.path] })[fileDescriptor.path];
          const tsFile = Object.assign({ declaration: typescriptDeclaration }, fileDescriptor);
          repoParams.packages[packageName].tsFiles[fileDescriptor.path] = tsFile;
          repoParams.tsFiles[fileDescriptor.path] = tsFile;
        }
      }
    }
  }

  // private static async generateDirectoryMap(dir: string): Promise<TsFile> {
  //   const stat = await fs.stat(dir);
  //   let map: TsFile = {
  //     name: path.basename(dir),
  //     path: dir,
  //     type: stat.isDirectory() ? 'folder' : 'file'
  //   };

  //   if (stat.isDirectory()) {
  //     const childrenNames = await fs.readdir(dir);
  //     map.children = await Promise.all(
  //       childrenNames.map(child => RepoFactory.generateDirectoryMap(path.join(dir, child)))
  //     );
  //   } else if (dir.endsWith('.ts') || dir.endsWith('.tsx')) {
  //     const declarations = this.generateDeclarations({ tsFilePaths: [dir] });
  //     const declarationFilePath = path.join(path.dirname(dir), path.basename(dir, path.extname(dir))) + '.d.ts';
  //     // console.log(`dir: ${dir}\ndeclarationFilePath: ${declarationFilePath}`);
  //     if (declarations[declarationFilePath]) {
  //       map.declaration = declarations[declarationFilePath];
  //     }
  //   }

  //   return map;
  // }
}
