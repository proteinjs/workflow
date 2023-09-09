import { Template } from "./util/template";
import { Paragraph } from "./util/paragraph";
import { Sentence } from "./util/sentence";

export type TableArgs = {
  name: string,
  cloudService: string,
  databaseName: string,
  columns?: {[name: string]: string},
  additionalInstructions?: string,
}

export class Table extends Template {
  private args: TableArgs;

  constructor(args: TableArgs) {
    super();
    this.args = Object.assign(args, { name: args.name.charAt(0).toUpperCase() + args.name.slice(1) });
  }

  files() {
    return {
      table: this.filePath(`${this.args.name}.ts`)
    };
  }

  async generate(): Promise<void> {
    const { name, databaseName, cloudService, columns, additionalInstructions } = this.args;
    const paragraph = new Paragraph();
    const createSentence = new Sentence();
    paragraph.add(createSentence);
    createSentence.add(`Create CURD operations for a table named ${name.toLocaleLowerCase()} in dataset ${databaseName}`);
    createSentence.add(`hosted with ${cloudService}`);
    if (columns)
      createSentence.add(`with columns: ${JSON.stringify(columns)}`);

    if (additionalInstructions)
      paragraph.add(new Sentence().add(additionalInstructions));

    const description = paragraph.toString();
    const code = await this.generateCode(description);
    await this.writeFiles([{
      relativePath: this.files().table,
      content: code  
    }]);
    await this.installPackage([{ name: '@google-cloud/bigquery', version: '7.2.0' }]);
  }
}