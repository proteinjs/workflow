import { Logger } from './Logger';
import { cmd } from './cmd';
import ts from 'typescript';

export type Package = { 
  name: string, 
  version?: string, 
  exactVersion?: boolean, 
  development?: boolean 
}

export class PackageUtil {
  private static LOGGER = new Logger('PackageUtil');

  /**
   * @param packages packages to install
   * @param cwdPath directory to execute the command from
   */
  static async installPackages(packages: Package[], cwdPath?: string) {
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
      let envVars;
      if (cwdPath)
        envVars = { cwd: cwdPath }
      PackageUtil.LOGGER.info(`Running command: ${command}`);
      await cmd('npm', args, envVars);
      PackageUtil.LOGGER.info(`Ran command: ${command}`);
    }
  }

  static async runPackageScript(name: string, cwdPath?: string) {
    const args = [
      'run',
      name,
    ];
    const command = 'npm ' + args.join(' ');
    let envVars;
      if (cwdPath)
        envVars = { cwd: cwdPath }
    PackageUtil.LOGGER.info(`Running command: ${command}`);
    await cmd('npm', args, envVars);
    PackageUtil.LOGGER.info(`Ran command: ${command}`);
  }

  static async npmInstall(cwd: string) {
    const args = ['i'];
    const command = 'npm ' + args.join(' ');
    let envVars;
    if (cwd)
      envVars = { cwd: cwd }
    PackageUtil.LOGGER.info(`Running command: ${command}`);
    await cmd('npm', args, envVars);
    PackageUtil.LOGGER.info(`Ran command: ${command}`);
  }

  static generateTypescriptDeclarations(params: { tsFilePaths: string[], includeDependencyDeclarations?: boolean }): {[tsFilePath: string]: string} {
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
      PackageUtil.logCompilerErrors(result);
    } else {
      for (let tsFilePath of params.tsFilePaths) {
        const sourceFile = program.getSourceFile(tsFilePath);
        const result = program.emit(sourceFile, customWriteFile, undefined, true);
        PackageUtil.logCompilerErrors(result);
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