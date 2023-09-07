import path from 'path';

type Config = {
  srcPath: string,
  language?: {
    name: string,
    fileExtension: string,
  },
  runtime?: string,
  frameworks?: string[],
}

export class CodeGeneratorConfig {
  private static INSTANCE: CodeGeneratorConfig = new CodeGeneratorConfig({ 
    srcPath: `${process.cwd()}${path.sep}src`,
    language: { 
      name: 'typescript', 
      fileExtension: 'ts'
    },
    runtime: 'node',
  });
  config: Config;

  private constructor(config: Config) {
    this.config = config;
  }

  static set(config: Config) {
    const resolvedConfig = Object.assign(CodeGeneratorConfig.INSTANCE.config, config);
    CodeGeneratorConfig.INSTANCE = new CodeGeneratorConfig(resolvedConfig);
  }

  static get(): Config {
    return CodeGeneratorConfig.INSTANCE.config;
  }
}