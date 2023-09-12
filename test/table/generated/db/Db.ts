import { Table } from './Table';
import { BigQuery } from '@google-cloud/bigquery';

export class Db {
  private bigQueryClient: BigQuery;
  private dataset: string;

  constructor(projectId: string, dataset: string) {
    this.bigQueryClient = new BigQuery({projectId});
    this.dataset = dataset;
  }

  async insert(table: Table, rows: any[]): Promise<void> {
    const bqTable = this.bigQueryClient.dataset(this.dataset).table(table.name());
    await bqTable.insert(rows);
  }
}