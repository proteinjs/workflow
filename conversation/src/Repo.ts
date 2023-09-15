import fs from 'fs-extra';
import ts from 'typescript';

export type Repo = {
  rootTsFilePaths: string[],
  // imports: {[filePath: string]: string /** import */ }, // the imports of this file and all dependencies
  declarations: {[filePath: string]: string /** declaration */ }, // declarations for this file and its local dependencies
}

export class RepoFactory {
  private repo: Repo;

  constructor(tsFilePaths: string[]) {
    this.repo = {
      rootTsFilePaths: tsFilePaths,
      declarations: {},
    };
  }

  async create() {
    // read file
    // const file = (await fs.readFile(this.api.rootTsFilePath)).toString();
    // parse imports
    //  if relative imports, recursively read those files as well
    //  if regular imports, save them to an array
    // generate typescript declaration for file and save in a variable

    this.generateDeclarations(this.repo.rootTsFilePaths);
    return this.repo;
  }

  private generateDeclarations(tsFilePaths: string[]) {
    // Create a Program from a root file name.
    const program = ts.createProgram(tsFilePaths, {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        declaration: true,  // This is what makes the magic happen.
    });

    // Create a custom emit writer that writes to our variable.
    const customWriteFile: ts.WriteFileCallback = (fileName, data) => {
        if (fileName.endsWith('.d.ts')) {
            this.repo.declarations[fileName] = data;
        }
    };

    // Generate the declaration content.
    const result = program.emit(undefined, customWriteFile, undefined, true);

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