import fs from 'fs/promises';
import path from 'path';
import ts from 'typescript';

export interface DirectoryMap {
  name: string;
  path: string;
  type: 'folder' | 'file';
  declaration?: string;
  children?: DirectoryMap[];
}

export interface PackageInfo {
  package: any;  // The content of the package.json
  directoryMaps: DirectoryMap[];
}

export interface Repo {
  packages: Record<string, PackageInfo>;
}

export class RepoFactory {
  public static async createRepo(dir: string): Promise<Repo> {
    let repo: Repo = { packages: {} };

    async function traverse(dir: string, packageName?: string, parentHasPackageJson: boolean = false) {
      const childrenNames = await fs.readdir(dir, { withFileTypes: true });
      let hasPackageJson = childrenNames.some(dirent => dirent.name === 'package.json');
      if (hasPackageJson) {
        const packageContent = await fs.readFile(path.join(dir, 'package.json'), 'utf-8');
        const packageJSON = JSON.parse(packageContent);
        repo.packages[packageJSON.name] = { 
          package: packageJSON,
          directoryMaps: [],
        };
        packageName = packageJSON.name;
      }
      
      if (hasPackageJson || parentHasPackageJson) {
        for (const dirent of childrenNames) {
          if (!dirent.isDirectory())
            continue;

          // Exclude directories 'node_modules' and 'dist' right at the beginning
          if (dirent.name.includes('node_modules') || dirent.name.includes('dist')) {
            continue;
          }

          if (packageName) {
            try {
              const directoryMap = await RepoFactory.generateDirectoryMap(dirent.name);
              repo.packages[packageName].directoryMaps.push(directoryMap);
            } catch (error) {
              // Silently fail if there's an error reading the package.json
            }
          }

          // Continue with the traversal if it's a directory
          const childPath = path.join(dir, dirent.name);
          await traverse(childPath, packageName, hasPackageJson);
        }
      }
    }

    await traverse(dir);
    return repo;
  }

  private static async generateDirectoryMap(dir: string): Promise<DirectoryMap> {
    const stat = await fs.stat(dir);
    let map: DirectoryMap = {
      name: path.basename(dir),
      path: dir,
      type: stat.isDirectory() ? 'folder' : 'file'
    };

    if (stat.isDirectory()) {
      const childrenNames = await fs.readdir(dir);
      map.children = await Promise.all(
        childrenNames.map(child => RepoFactory.generateDirectoryMap(path.join(dir, child)))
      );
    } else if (dir.endsWith('.ts') || dir.endsWith('.tsx')) {
      const declarations = this.generateDeclarations([dir]);
      const declarationFilePath = path.join(path.dirname(dir), path.basename(dir, path.extname(dir))) + '.d.ts';
      if (declarations[declarationFilePath]) {
        map.declaration = declarations[declarationFilePath];
      }
    }

    return map;
  }

  static generateDeclarations(tsFilePaths: string[], includeDependencyDeclarations = false): {[filePath: string]: string} {
    // declarations for this file and its local dependencies
    const declarations: {[filePath: string]: string} = {};

    // Create a Program from a root file name.
    const program = ts.createProgram(tsFilePaths, {
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      declaration: true,  // This is what makes the magic happen.
      emitDeclarationOnly: true,
    });

    // Create a custom emit writer that writes to our variable.
    const customWriteFile: ts.WriteFileCallback = (fileName, data) => {
      if (fileName.endsWith('.d.ts')) {
        declarations[fileName] = data;
      }
    };

    // Generate the declaration content.
    if (includeDependencyDeclarations) {
      const result = program.emit(undefined, customWriteFile, undefined, true);
      this.logCompilerErrors(result);
    } else {
      for (let tsFilePath of tsFilePaths) {
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
