import { Template, TemplateArgs, Paragraph, Sentence, Dependency, Package } from '@brentbahry/conversation';

export type ServerTemplateArgs = {
  additionalInstructions?: string,
  additionalPackages?: Package[],
  replacePackages?: boolean,
  additionalDependencies?: Dependency[],
  replaceDependencies?: boolean,
}

export class ServerTemplate extends Template {
  private static GENERATED = false;
  static readonly RUNTIME = 'node';
  static readonly FRAMEWORK = 'express';
  private args: ServerTemplateArgs;

  constructor(args: ServerTemplateArgs & TemplateArgs) {
    super(args);
    this.args = Object.assign({ replaceDependencies: false }, args);
  }

  getFilePaths() {
    return {
      Server: this.filePath(`Server.ts`)
    };
  }

  async generate(): Promise<void> {
    if (ServerTemplate.GENERATED) {
      this.logger.info(`Preventing duplicate generation of Server`);
      return;
    }

    const packages: Package[] = this.args.replacePackages ? [] : [
      { name: 'express', version: '4.18.2' },
      { name: '@types/express', version: '4.17.17', development: true },
    ];
    if (this.args.additionalPackages)
      packages.push(...this.args.additionalPackages);

    await this.installPackages(packages);

    const dependencies: Dependency[] = this.args.replaceDependencies ? [] : [];
    if (this.args.additionalDependencies)
      dependencies.push(...this.args.additionalDependencies);

    this.addDependencies(dependencies);

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
      description.push(this.args.additionalInstructions);

    const code = await this.generateCode(description, 'gpt-4');
    await this.writeFiles([{ 
      path: this.getFilePaths().Server,
      content: code  
    }]);
    ServerTemplate.GENERATED = true;
  }
}