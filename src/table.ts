import { Template } from "./util/template";
import { Paragraph } from "./util/paragraph";
import { Sentence } from "./util/sentence";

export class Table extends Template {
  async generate(args: { 
    name: string, 
    cloudService: string,
    databaseName: string,
    columns?: {[name: string]: string},
    additionalInstructions?: string,
  }): Promise<void> {
    const paragraph = new Paragraph();
    const createSentence = new Sentence();
    paragraph.add(createSentence);
    createSentence.add(`Create CURD operations for a table named ${args.name} in dataset ${args.databaseName}`);
    createSentence.add(`hosted with ${args.cloudService}`);
    if (args.columns)
      createSentence.add(`with columns: ${JSON.stringify(args.columns)}`);

    if (args.additionalInstructions)
      paragraph.add(new Sentence().add(args.additionalInstructions));

    const description = paragraph.toString();
    const code = await this.generateCode(description);
    await this.writeFiles([{ 
      name: args.name,
      extension: 'ts',
      relativePath: this.constructor.name,
      content: code  
    }]);
    await this.installPackage([{ name: '@google-cloud/bigquery', version: '7.2.0' }]);
  }
}