import { Dependency, Package, Template, TemplateArgs } from '@brentbahry/conversation';

export type ServiceTemplateArgs = {
  name: string,
  functionBody: string,
  parameters?: any,
  returnType?: any,
  path?: string,
  additionalInstructions?: string[],
  additionalPackages?: Package[],
  additionalDependencies?: Dependency[],
  replaceDependencies?: boolean,
}

export class ServiceTemplate extends Template {
  private args: ServiceTemplateArgs;

  constructor(args: ServiceTemplateArgs & TemplateArgs) {
    super(args);
    this.args = Object.assign({ replaceDependencies: false }, Object.assign(args, { 
      name: args.name.charAt(0).toUpperCase() + args.name.slice(1)
    }));
  }

  getFilePaths() {
    return {
      service: this.filePath(`${this.args.name}.ts`)
    };
  }

  async generate(): Promise<void> {
    const { name, functionBody, parameters, returnType, additionalInstructions } = this.args;
    const packages: Package[] = [
      { name: '@brentbahry/service', version: '../service', exactVersion: false },
    ];
    if (this.args.additionalPackages)
      packages.push(...this.args.additionalPackages);

    await this.installPackages(packages);

    const dependencies: Dependency[] = this.args.replaceDependencies ? [] : [
      { moduleNames: ['Service'], importPathFromGeneratedFile: '@brentbahry/service', filePath: require.resolve('@brentbahry/service/src/generated/Service.ts') },
      { moduleNames: ['ServiceLoader'], importPathFromGeneratedFile: '@brentbahry/service', filePath: require.resolve('@brentbahry/service/src/generated/ServiceLoader.ts') },
    ];
    if (this.args.additionalDependencies)
      dependencies.push(...this.args.additionalDependencies);

    this.addDependencies(dependencies);

    const description = [
      `Create a Service implementation named ${name}`,
      `Load the service into the ServiceLoader`,
    ];
    const resolvedPath = this.args.path ? this.args.path : 'the name of the service in lowercase';
    description.push(`Set the path property of this service to /${resolvedPath}`);
    if (parameters)
      description.push(`The call function should have the following parameters: ${JSON.stringify(parameters)}`);
    
    if (returnType)
      description.push(`The call function should have a return type of: ${JSON.stringify(returnType)}`);
    
    description.push(`The call function should have the following implementation: ${functionBody}`);
    if (additionalInstructions)
      description.push(...additionalInstructions);

    const code = await this.generateCode(description);
    await this.writeFiles([{ 
      path: this.getFilePaths().service,
      content: code  
    }]);
  }
}