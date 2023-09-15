import { Template, TemplateArgs, Paragraph, Sentence } from '@brentbahry/conversation';

export type ServerTemplateArgs = {
  additionalInstructions?: string,
}

export class ServerTemplate extends Template {
  private static GENERATED = false;
  static readonly RUNTIME = 'node';
  static readonly FRAMEWORK = 'express';
  private args: ServerTemplateArgs;

  constructor(args: ServerTemplateArgs & TemplateArgs) {
    super(args);
    this.args = args;
  }

  files() {
    return {
      server: this.filePath(`Server.ts`)
    };
  }

  async generate(): Promise<void> {
    if (ServerTemplate.GENERATED) {
      this.logger.info(`Preventing duplicate generation of Server`);
      return;
    }

    const description = new Paragraph();
    description.add(new Sentence().add(`Create and export a Server class written in typescript, in ${ServerTemplate.RUNTIME}, using ${ServerTemplate.FRAMEWORK}`));
    description.add(new Sentence().add(`The server should be a singleton class with a start method that initializes the server`));
    description.add(new Sentence().add(`Create and method named stop that stops the server returned by app.listen`));
    description.add(new Sentence().add(`Create and method named setPort to set the port the server listens on`));
    description.add(new Sentence().add(`Default the port to 3000`));
    description.add(new Sentence().add(`Create and method named addRouteLoader that takes in a function (server) => void and stores this loader function in a member array`));
    description.add(new Sentence().add(`The start method should iterate through routeLoaders and invoke them to register routes`));
    description.add(new Sentence().add(`Do not define an example route`));
    description.add(new Sentence().add(`Use the express json plugin`));

    if (this.args.additionalInstructions)
      description.add(new Sentence().add(this.args.additionalInstructions));

    const code = await this.generateCode(description.toString(), 'gpt-4');
    await this.writeFiles([{ 
      path: this.files().server,
      content: code  
    }]);
    await this.installPackage([
      { name: 'express', version: '4.18.2' },
      { name: '@types/express', version: '4.17.17', development: true },
    ]);
    ServerTemplate.GENERATED = true;
  }
}