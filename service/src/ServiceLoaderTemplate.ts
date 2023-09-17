import { CodeTemplate, TemplateArgs, SourceFile, Code, Conversation, Import } from '@brentbahry/conversation';
import { ServerTemplate } from '@brentbahry/server';
import { Server } from '@brentbahry/server/src/generated/Server';
import { Service } from './Service';

export type ServiceLoaderTemplateArgs = {
  additionalInstructions?: string[],
}

export class ServiceLoaderTemplate extends CodeTemplate {
  private args: ServiceLoaderTemplateArgs;

  constructor(args: ServiceLoaderTemplateArgs & TemplateArgs) {
    super(args);
    this.args = args;
  }

  dependencyPackages() {
    return [
      { name: 'express', version: '4.18.2' },
      { name: '@types/express', version: '4.17.17', development: true },
      { name: '@brentbahry/server', version: '../server', exactVersion: false },
    ];
  }

  sourceFiles() {
    return [
      this.serviceLoader(),
    ];
  }

  private serviceLoader(): SourceFile {
    const conversation = new Conversation({ conversationName: this.constructor.name });
    const description = [
      `Create a singleton class ServiceLoader implements RouteLoader`,
      `Create a static method named loadService(service: Service) that adds services to a member array`,
      `Create a method named loadServices(server: Express) that iterates through all Services and registers them as routes with the server so that when a request comes in matching a service's path, its call function is invoked with the request data, and the output of the function is written as a response to the request`,
      `Register the ServiceLoader as a RoutLoader with the Server`,
      `Let the catch block error param be of type any`,
    ];
    if (this.args.additionalInstructions)
      description.push(...this.args.additionalInstructions);

    return {
      relativePath: 'ServiceLoader.ts',
      code: new Code({
        conversation,
        imports: [
          { moduleNames: ['Service'], importPathFromGeneratedFile: '../Service', sourceFilePath: require.resolve('./Service.ts') },
          { moduleNames: ['Server', 'RouteLoader'], importPathFromGeneratedFile: '@brentbahry/server', sourceFilePath: require.resolve('@brentbahry/server/src/generated/Server.ts') },
        ],
        description,
      }),
    };
  }
}