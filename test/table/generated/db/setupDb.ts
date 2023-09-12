import { BigQuery, Dataset, Table } from '@google-cloud/bigquery';
import { Table as MyTable } from './Table';
import { getTables } from './getTables';

export class BigQueryClient {
  private client: BigQuery;

  constructor(projectId: string) {
    this.client = new BigQuery({ projectId });
  }

  async createDataset(datasetId: string): Promise<Dataset> {
    const [dataset] = await this.client.createDataset(datasetId);
    return dataset;
  }

  async getDataset(datasetId: string): Promise<Dataset> {
    const [dataset] = await this.client.dataset(datasetId).get();
    return dataset;
  }

  async createTable(dataset: Dataset, table: MyTable): Promise<Table> {
    const [bqTable] = await dataset.createTable(table.name(), table.columns());
    return bqTable;
  }

  async getTable(dataset: Dataset, tableName: string): Promise<Table> {
    const [table] = await dataset.table(tableName).get();
    return table;
  }

  async updateTableSchema(table: Table, schema: any): Promise<Table> {
    const [updatedTable] = await table.setMetadata({ schema });
    return updatedTable;
  }
}

export async function setupDb() {
  const bigQueryClient = new BigQueryClient('test-bigquery-398804');
  let dataset: Dataset;

  try {
    dataset = await bigQueryClient.getDataset('test');
  } catch (error) {
    dataset = await bigQueryClient.createDataset('test');
  }

  const tables = getTables();

  for (const table of tables) {
    let bqTable: Table;

    try {
      bqTable = await bigQueryClient.getTable(dataset, table.name());
    } catch (error) {
      bqTable = await bigQueryClient.createTable(dataset, table);
    }

    await bigQueryClient.updateTableSchema(bqTable, table.columns());
  }
}