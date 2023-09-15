import { Template, TemplateArgs, Paragraph, Sentence } from '@brentbahry/conversation';

export type ServerArgs = {
  port?: string,
  additionalInstructions?: string,
}

export class Server extends Template {
  private static GENERATED = false;
  static readonly RUNTIME = 'node';
  static readonly FRAMEWORK = 'express';
  private args: ServerArgs;

  constructor(args: ServerArgs & TemplateArgs) {
    super(args);
    this.args = Object.assign({
      port: '3000',
    }, args);
  }

  files() {
    return {
      server: this.filePath(`${this.constructor.name}.ts`)
    };
  }

  async generate(): Promise<void> {
    if (Server.GENERATED) {
      this.logger.info(`Preventing duplicate generation of ${this.constructor.name}`);
      return;
    }

    const paragraph = new Paragraph();
    const createSentence = new Sentence();
    paragraph.add(createSentence);
    createSentence.add(`Create a server written in typescript, in ${Server.RUNTIME}, using ${Server.FRAMEWORK}`);
    paragraph.add(new Sentence().add(`Serve traffic on port ${this.args.port}`));
    paragraph.add(new Sentence().add(`Create and export a function named stop that stops the server returned by app.listen`));
    paragraph.add(new Sentence().add(`Do not define an example route`));
    paragraph.add(new Sentence().add(`Use the express json plugin`));

    if (this.args.additionalInstructions)
      paragraph.add(new Sentence().add(this.args.additionalInstructions));

    const description = paragraph.toString();
    const code = await this.generateCode(description);
    await this.writeFiles([{ 
      path: this.files().server,
      content: code  
    }]);
    await this.installPackage([
      { name: 'express', version: '4.18.2' },
      { name: '@types/express', version: '4.17.17', development: true },
    ]);
    Server.GENERATED = true;
  }
}