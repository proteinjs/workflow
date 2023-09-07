import { Template } from "./util/template";
import { Paragraph } from "./util/paragraph";
import { Sentence } from "./util/sentence";
import { CodeGeneratorConfig } from "./util/CodeGeneratorConfig";

export class Server extends Template {
  private static GENERATED = false;

  async generate(args: {
    language?: {
      name: string,
      fileExtension: string,
    },
    runtime?: string,
    framework?: string,
    additionalInstructions?: string,
  }): Promise<void> {
    if (Server.GENERATED) {
      console.log(`Preventing duplicate generation of ${this.constructor.name}`);
      return;
    }

    const paragraph = new Paragraph();
    const createSentence = new Sentence();
    paragraph.add(createSentence);
    const language = args.language ? args.language.name : CodeGeneratorConfig.get().language?.name;
    const runtime = args.runtime ? args.runtime : CodeGeneratorConfig.get().runtime;
    createSentence.add(`Create a server written in ${language}, in ${runtime}`);
    if (args.framework)
      createSentence.add(`using ${args.framework}`);

    if (args.additionalInstructions)
      paragraph.add(new Sentence().add(args.additionalInstructions));

    const description = paragraph.toString();
    const code = await this.generateCode(description);
    await this.writeFiles([{ 
      name: this.constructor.name,
      extension: args.language?.fileExtension ? args.language.fileExtension : 'ts',
      content: code  
    }]);
    Server.GENERATED = true;
  }
}