import { Template } from "./util/template";
import { Paragraph } from "./util/paragraph";
import { Sentence } from "./util/sentence";
import { CodeGeneratorConfig } from "./util/CodeGeneratorConfig";

export type ServerArgs = {
  runtime?: string,
  framework?: string,
  port?: string,
  additionalInstructions?: string,
}

export class Server extends Template {
  private static GENERATED = false;
  private args?: ServerArgs;

  constructor(args?: ServerArgs) {
    super();
    this.args = args;
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
    const runtime = this.args?.runtime ? this.args.runtime : CodeGeneratorConfig.get().runtime;
    createSentence.add(`Create a server written in ${CodeGeneratorConfig.get().language?.name}, in ${runtime}`);
    if (this.args?.framework)
      createSentence.add(`using ${this.args.framework}`);

    const port = this.args?.port ? this.args.port : '3000';
    paragraph.add(new Sentence().add(`Serve traffic on port ${port}`));
    paragraph.add(new Sentence().add(`Also create and export a function named stop that stops the server`));

    if (this.args?.additionalInstructions)
      paragraph.add(new Sentence().add(this.args.additionalInstructions));

    const description = paragraph.toString();
    const code = await this.generateCode(description);
    await this.writeFiles([{ 
      relativePath: this.files().server,
      content: code  
    }]);
    await this.installPackage([
      { name: 'express', version: '4.18.2' },
      { name: '@types/express', development: true },
    ]);
    Server.GENERATED = true;
  }
}