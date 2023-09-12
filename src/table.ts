import { Template } from "./util/template";
import { Paragraph } from "./util/paragraph";
import { Sentence } from "./util/sentence";

export type TableArgs = {
  name: string,
  databaseName: string,
  projectId: string,
  columns?: {[name: string]: string},
  additionalInstructions?: string,
}

/**
 * To use:
 * 1. Create a google cloud account
 * 2. Create a project in google cloud
 * 3. Setup default credentials on your machine: https://cloud.google.com/docs/authentication/provide-credentials-adc#local-dev
 * 4. Set your project to be used with default credentials: https://cloud.google.com/sdk/gcloud/reference/auth/application-default/set-quota-project
 */
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
    const { name, databaseName, projectId, columns, additionalInstructions } = this.args;
    const paragraph = new Paragraph();
    const createSentence = new Sentence();
    paragraph.add(createSentence);
    createSentence.add(`Create CURD operations for a table named ${name.toLocaleLowerCase()} in dataset ${databaseName}`);
    createSentence.add(`hosted with Google Cloud BigQuery`);
    if (columns)
      createSentence.add(`with columns: ${JSON.stringify(columns)}`);
    
    createSentence.add(`in project ${projectId}`);
    paragraph.add(new Sentence().add(`For the read function, pass in the query as part of the options object to the query api`));
    paragraph.add(new Sentence().add(`Create a function to create the dataset and table if they do not exist`));
    if (additionalInstructions)
      paragraph.add(new Sentence().add(additionalInstructions));

    const description = paragraph.toString();
    const code = await this.generateCode(description, 'gpt-4');
    await this.writeFiles([{
      path: this.files().table,
      content: code  
    }]);
    await this.installPackage([{ name: '@google-cloud/bigquery', version: '7.2.0' }]);
  }
}