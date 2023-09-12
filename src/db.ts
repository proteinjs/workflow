import { Template } from "./util/template";
import { Paragraph } from "./util/paragraph";
import { Sentence } from "./util/sentence";

export type DbArgs = {
  dataset: string,
  projectId: string,
  additionalInstructions?: string,
}

/**
 * To use:
 * 1. Create a google cloud account
 * 2. Create a project in google cloud
 * 3. Setup default credentials on your machine: https://cloud.google.com/docs/authentication/provide-credentials-adc#local-dev
 * 4. Set your project to be used with default credentials: https://cloud.google.com/sdk/gcloud/reference/auth/application-default/set-quota-project
 */
export class Db extends Template {
  private args: DbArgs;

  constructor(args: DbArgs) {
    super();
    this.args = args;
  }

  files() {
    return {
      table: this.filePath(`Table.ts`),
      getTables: this.filePath(`getTables.ts`),
      setupDb: this.filePath(`setupDb.ts`),
      db: this.filePath(`${this.constructor.name}.ts`),
    };
  }

  apiDescriptions() {
    return {
      table: `an abstract class named Table with an abstract function name(): string and an abstract function columns(): any`,
    };
  }

  async generate(): Promise<void> {
    const { dataset: dataSet, projectId, additionalInstructions } = this.args;
    await this.createTable();
    await this.createGetTables();
    await this.createSetupDb();
    const description = new Paragraph();
    description.add(new Sentence().add(`Assume ${this.apiDescriptions().table} exists in another file`));
    description.add(new Sentence().add(`Import { Table } from ${this.relativePath(this.files().setupDb, this.files().table)}`));
    description.add(new Sentence().add(`Create a class named Db that has a constructor(projectId: string, dataset:string)`));
    description.add(new Sentence().add(`Db should have a BigQuery client instantiated with projectId as an instance member variable`));
    description.add(new Sentence().add(`Db should store dataset as an instance variable`));
    this.createInsert(description);

    if (additionalInstructions)
      description.add(new Sentence().add(additionalInstructions));

    const code = await this.generateCode(description.toString(), 'gpt-4');
    await this.writeFiles([{
      path: this.files().db,
      content: code  
    }]);
    await this.installPackage([{ name: '@google-cloud/bigquery', version: '7.2.0' }]);
  }

  private async createTable() {
    const description = new Sentence().add(`Create ${this.apiDescriptions().table}`);
    const code = await this.generateCode(description.toString());
    await this.writeFiles([{
      path: this.files().table,
      content: code  
    }]);
  }

  private async createGetTables() {
    const description = new Paragraph();
    description.add(new Sentence().add(`Assume ${this.apiDescriptions().table} exists`));
    description.add(new Sentence().add(`Import { Table } from ${this.relativePath(this.files().getTables, this.files().table)}`));
    description.add(new Sentence().add(`Create a function getTables(): Table[] that returns an empty array of tables`));
    const code = await this.generateCode(description.toString());
    await this.writeFiles([{
      path: this.files().getTables,
      content: code  
    }]);
  }

  private async createSetupDb() {
    const description = new Paragraph();
    description.add(new Sentence().add(`Assume ${this.apiDescriptions().table} exists in another file`));
    description.add(new Sentence().add(`Import { Table } from ${this.relativePath(this.files().setupDb, this.files().table)}`));
    description.add(new Sentence().add(`Import { getTables } from ${this.relativePath(this.files().setupDb, this.files().getTables)}`));
    description.add(new Sentence().add(`Create a function named setupDb that creates the dataset ${this.args.dataset} if it doesn't exist in Google Cloud BigQuery`));
    description.add(new Sentence().add(`Instantiate BigQuery client with projectId ${this.args.projectId}`));
    description.add(new Sentence().add(`The setupDb function should then iterate through all tables and create them and update their schema if necessary`));
    description.add(new Sentence().add(`Implement all helper functions using the BigQuery client`));
    const code = await this.generateCode(description.toString(), 'gpt-4');
    await this.writeFiles([{
      path: this.files().setupDb,
      content: code  
    }]);
  }

  private createInsert(description: Paragraph) {
    description.add(new Sentence().add(`Create method insert(table: Table, rows: any[]) that inserts rows into the table`));
  }

  private createDeleteDataset(description: Paragraph) {
    description.add(new Sentence().add(`Create method deleteDataset() that deletes the dataset`));
  }
}