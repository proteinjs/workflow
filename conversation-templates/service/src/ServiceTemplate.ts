import { Code, CodeTemplate, Conversation, Import, SourceFile, TemplateArgs } from '@brentbahry/conversation';

export type ServiceTemplateArgs = {
  name: string,
  functionBody: string,
  parameters?: any,
  returnType?: any,
  path?: string,
  additionalInstructions?: string[],
  additionalImports?: Import[],
  replaceImports?: boolean,
}

export class ServiceTemplate extends CodeTemplate {
  private args: ServiceTemplateArgs;

  constructor(args: ServiceTemplateArgs & TemplateArgs) {
    super(args);
    this.args = Object.assign(args, { 
      name: args.name.charAt(0).toUpperCase() + args.name.slice(1)
    });
  }

  dependencyPackages() {
    return [
      { name: '@brentbahry/service', version: '../service', exactVersion: false },
    ];
  }

  sourceFiles() {
    return [
      this.service(),
    ];
  }

  private service(): SourceFile {
    const conversation = new Conversation({ conversationName: this.constructor.name });
    const description = [
      `Create a Service implementation named ${this.args.name}`,
      `Load the service into the ServiceLoader via ServiceLoader.loadService`,
      `Do not generate a call to Server.addRouteLoader`,
      `Do not generate a call to Server.setPort`,
    ];
    const resolvedPath = this.args.path ? this.args.path : 'the name of the service in lowercase';
    description.push(`Set the path property of this service to /${resolvedPath}`);
    if (this.args.parameters)
      description.push(`The call function should have the following parameters: ${JSON.stringify(this.args.parameters)}`);
    
    if (this.args.returnType)
      description.push(`The call function should have a return type of: ${JSON.stringify(this.args.returnType)}`);
    
    description.push(`The call function should have the following implementation: ${this.args.functionBody}`);
    if (this.args.additionalInstructions)
      description.push(...this.args.additionalInstructions);

    const imports: Import[] = this.args.replaceImports ? [] : [
      { moduleNames: ['Service'], importPathFromGeneratedFile: '@brentbahry/service', sourceFilePath: require.resolve('@brentbahry/service/src/generated/Service.ts') },
      { moduleNames: ['ServiceLoader'], importPathFromGeneratedFile: '@brentbahry/service', sourceFilePath: require.resolve('@brentbahry/service/src/generated/ServiceLoader.ts') },
    ];
    if (this.args.additionalImports)
      imports.push(...this.args.additionalImports);

    return {
      relativePath: `${this.args.name}.ts`,
      code: new Code({
        conversation,
        imports,
        description,
      }),
    };
  }
}