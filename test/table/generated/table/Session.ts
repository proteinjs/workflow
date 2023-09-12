import {BigQuery, Dataset, Table} from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  projectId: 'test-bigquery-398804',
});

const datasetId = 'test';
const tableId = 'session';

interface Session {
  id: string;
  created: string;
  updated: string;
  sessionId: string;
  session: string;
}

export async function createDatasetAndTable() {
  let dataset: Dataset = bigquery.dataset(datasetId);
  let [exists] = await dataset.exists();
  if (!exists) {
    [dataset] = await bigquery.createDataset(datasetId);
  }

  let table: Table = dataset.table(tableId);
  [exists] = await table.exists();
  if (!exists) {
    [table] = await dataset.createTable(tableId, {
      schema: 'id:string, created:string, updated:string, sessionId:string, session:string',
    });
  }
}

export async function createSession(session: Session) {
  const table = bigquery.dataset(datasetId).table(tableId);
  await table.insert(session);
}

export async function readSessions(query: string) {
  const [rows] = await bigquery.query({query});
  return rows;
}

export async function updateSession(session: Session) {
  const table = bigquery.dataset(datasetId).table(tableId);
  await table.update(session);
}

export async function deleteSession(sessionId: string) {
  const table = bigquery.dataset(datasetId).table(tableId);
  await table.deleteRows([{id: sessionId}]);
}