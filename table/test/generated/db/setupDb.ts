import { BigQuery, Dataset, Table as BqTable } from '@google-cloud/bigquery';
import { Table } from './Table';
import { getTables } from './getTables';

export async function setupDb(datasetId: string, projectId: string): Promise<void> {
  const bigquery = new BigQuery({ projectId });
  let dataset = bigquery.dataset(datasetId);

  const [datasetExists] = await dataset.exists();
  if (!datasetExists) {
    [dataset] = await bigquery.createDataset(datasetId);
  }

  const tables = getTables();
  for (const table of tables) {
    let bqTable: BqTable = dataset.table(table.name());
    const [tableExists] = await bqTable.exists();

    if (!tableExists) {
      [bqTable] = await dataset.createTable(table.name(), { schema: table.columns() });
    } else {
      await bqTable.setMetadata({ schema: table.columns() });
    }
  }
}