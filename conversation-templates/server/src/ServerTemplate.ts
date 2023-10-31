import { CodeTemplate, TemplateArgs, Code, Conversation, SourceFile } from '@brentbahry/conversation';

export type ServerTemplateArgs = {
  additionalInstructions?: string[],
}

export class ServerTemplate extends CodeTemplate {
  static readonly RUNTIME = 'node';
  static readonly FRAMEWORK = 'express';
  private args: ServerTemplateArgs;

  constructor(args: ServerTemplateArgs & TemplateArgs) {
    super(args);
    this.args = args;
  }

  dependencyPackages() {
    return [
      { name: 'express', version: '4.18.2' },
      { name: '@types/express', version: '4.17.17', development: true },
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
      `Create and export a Server class written in typescript, in ${ServerTemplate.RUNTIME}, using ${ServerTemplate.FRAMEWORK}`,
      `The server should be a singleton class with a static start method that initializes the server`,
      `Create a static method named stop that stops the server returned by app.listen`,
      `Create a static method named setPort to set the port the server listens on`,
      `Default the port to 3000`,
      `Create and export an interface named RouteLoader that has function loadRoutes(server) => void`,
      `Create a static method named addRouteLoader that takes in a RouteLoader and stores this instance in a member array in the singleton instance`,
      `The start method should iterate through routeLoaders and invoke them to load routes`,
      `Do not define an example route`,
      `Use the express json plugin`,
    ];
    if (this.args.additionalInstructions)
      description.push(...this.args.additionalInstructions);

    return {
      relativePath: 'Server.ts',
      code: new Code({
        conversation,
        description,
      }),
    };
  }
}