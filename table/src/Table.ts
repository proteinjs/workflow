import { Template, TemplateArgs, Paragraph, Sentence } from '@brentbahry/conversation';
import { Db } from '@brentbahry/db';

export type TableArgs = {
  name: string,
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

  constructor(args: TableArgs & TemplateArgs) {
    super(args);
    this.args = Object.assign(args, { name: args.name.charAt(0).toUpperCase() + args.name.slice(1) });
  }

  files() {
    return {
      table: this.filePath(`${this.args.name}.ts`)
    };
  }

  async generate(): Promise<void> {
    const { name, columns, additionalInstructions } = this.args;
    
    const db = new Db(this.templateArgs);
    await db.generate();
    
    const description = new Paragraph();
    description.add(new Sentence().add(`Assume ${db.apiDescriptions().table} exists in another file`));
    description.add(new Sentence().add(`Import { Table } from ${this.relativePath(this.files().table, db.files().table)}`));
    description.add(new Sentence().add(`Create a table named ${name}`));
    description.add(new Sentence().add(`name() should return ${name.toLocaleLowerCase()}`));
    if (columns)
      description.add(new Sentence().add(`Specify the table columns as an array of {name: string, type: string} from this data: ${JSON.stringify(columns)}`));

    if (additionalInstructions)
      description.add(new Sentence().add(additionalInstructions));

    const code = await this.generateCode(description.toString());
    await this.writeFiles([{
      path: this.files().table,
      content: code  
    }]);

    const registerTableWithGetTablesDescription = new Paragraph()
      .add(new Sentence().add(`Import ${name} from ${this.relativePath(db.files().getTables, this.files().table)}`))
      .add(new Sentence().add(`Add ${name} to the tables array`))
    .toString();
    const serviceLoaderUpdateCode = await this.updateCode(db.files().getTables, [this.files().table], registerTableWithGetTablesDescription);
    await this.writeFiles([{ 
      path: db.files().getTables,
      content: serviceLoaderUpdateCode  
    }]);
  }
}