import { Dependency, Package, Template, TemplateArgs } from '@brentbahry/conversation';
import { ServerTemplate } from '@brentbahry/server';
import { Server } from '@brentbahry/server/src/generated/Server';
import { Service } from './Service';

export type ServiceLoaderTemplateArgs = {
  additionalInstructions?: string[],
  additionalPackages?: Package[],
  replacePackages?: boolean,
  additionalDependencies?: Dependency[],
  replaceDependencies?: boolean,
}

type FilePaths = {
  ServiceLoader: string,
}

export class ServiceLoaderTemplate extends Template {
  private static GENERATED = false;
  private args: ServiceLoaderTemplateArgs;
  private filePaths?: FilePaths;

  constructor(args: ServiceLoaderTemplateArgs & TemplateArgs) {
    super(args);
    this.args = args;
  }

  getFilePaths(): FilePaths {
    if (!this.filePaths) {
      this.filePaths = {
        ServiceLoader: this.filePath(`ServiceLoader.ts`)
      };
    }

    return this.filePaths;
  }

  async generate(): Promise<void> {
    const { additionalInstructions } = this.args;
    if (ServiceLoaderTemplate.GENERATED) {
      this.logger.info(`Preventing duplicate generation of ServiceLoader`);
      return;
    }

    const packages: Package[] = this.args.replacePackages ? [] : [
      { name: 'express', version: '4.18.2' },
      { name: '@types/express', version: '4.17.17', development: true },
      { name: '@brentbahry/server', version: '../server', exactVersion: false },
    ];
    if (this.args.additionalPackages)
      packages.push(...this.args.additionalPackages);

    await this.installPackages(packages);

    const dependencies: Dependency[] = this.args.replaceDependencies ? [] : [
      { moduleNames: ['Service'], importPathFromGeneratedFile: '../Service', filePath: require.resolve('./Service.ts') },
      { moduleNames: ['Server', 'RouteLoader'], importPathFromGeneratedFile: '@brentbahry/server', filePath: require.resolve('@brentbahry/server/src/generated/Server.ts') },
    ];
    if (this.args.additionalDependencies)
      dependencies.push(...this.args.additionalDependencies);

    this.addDependencies(dependencies);

    const serviceLoaderDescription = [
      `Create a singleton class ServiceLoader implements RouteLoader`,
      `Create a static method named loadService(service: Service) that adds services to a member array`,
      `Create a method named loadServices(server: Express) that iterates through all Services and registers them as routes with the server so that when a request comes in matching a service's path, its call function is invoked with the request data, and the output of the function is written as a response to the request`,
      `Register the ServiceLoader as a RoutLoader with the Server`,
      `Let the catch block error param be of type any`,
    ];
    if (additionalInstructions)
      serviceLoaderDescription.push(...additionalInstructions);

    const serviceLoaderCode = await this.generateCode(serviceLoaderDescription, 'gpt-4');
    await this.writeFiles([{ 
      path: this.getFilePaths().ServiceLoader,
      content: serviceLoaderCode  
    }]);
    ServiceLoaderTemplate.GENERATED = true;
  }
}