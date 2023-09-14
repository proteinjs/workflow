import { BigQuery } from '@google-cloud/bigquery';
import { Table } from '../../src/table';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 1. session 2. { "id": "string", "sessionId": "string", "session": "string" }
// src/example
test('Create dataset and table', async () => {
  const tableName = 'session';
  const dataset = 'test';
  const projectId = 'test-bigquery-398804';
  await new Table({
    srcPath: `${process.cwd()}/test/table/generated`,
    name: tableName,
    columns: { 
      id: 'string',
      created: 'string',
      updated: 'string',
      sessionId: 'string',
      session: 'string',
    },
  }).generate();
  await delay(2000);
  const setupDb = require('../../dist/test/table/generated/db/setupDb.js')['setupDb'];
  await setupDb(dataset, projectId);
  const bqDataset = new BigQuery({projectId}).dataset(dataset);
  try {
    expect((await bqDataset.exists())[0]).toBeTruthy(); 
    const table = bqDataset.table(tableName);
    expect((await table.exists())[0]).toBeTruthy();
    const query = `
      SELECT column_name, data_type
      FROM \`${dataset}.INFORMATION_SCHEMA.COLUMNS\`
      WHERE table_name = '${tableName}'
    `;
    const [columns] = await bqDataset.query({query});
    expect(JSON.stringify(columns)).toBe(JSON.stringify([
      { column_name: 'id', data_type: 'STRING' },
      { column_name: 'created', data_type: 'STRING' },
      { column_name: 'updated', data_type: 'STRING' },
      { column_name: 'sessionId', data_type: 'STRING' },
      { column_name: 'session', data_type: 'STRING' }
    ]));
    await table.delete();
    expect((await table.exists())[0]).toBeFalsy(); 
    await bqDataset.delete();
    expect((await bqDataset.exists())[0]).toBeFalsy();
  } finally {
    try {
      if ((await bqDataset.exists())[0])
        await bqDataset.delete();
    } catch (error) {}
  }
}, 60000);

test('Insert into table', async () => {
  const tableName = 'session';
  const dataset = 'test';
  const projectId = 'test-bigquery-398804';
  await new Table({
    srcPath: `${process.cwd()}/test/table/generated`,
    name: tableName,
    columns: { 
      id: 'string',
      created: 'string',
      updated: 'string',
      sessionId: 'string',
      session: 'string',
    },
  }).generate();
  await delay(2000);
  const setupDb = require('../../dist/test/table/generated/db/setupDb.js')['setupDb'];
  await setupDb(dataset, projectId);
  const bqDataset = new BigQuery({projectId}).dataset(dataset);
  try {
    expect((await bqDataset.exists())[0]).toBeTruthy(); 
    const table = bqDataset.table(tableName);
    expect((await table.exists())[0]).toBeTruthy();
    const Db = require('../../dist/test/table/generated/db/Db.js')['Db'];
    const db = new Db(projectId, dataset);
    const sampleSessionId = '1234';
    const Session = require('../../dist/test/table/generated/table/Session.js')['Session'];
    const sessionTable = new Session();
    await db.insert(sessionTable, [{
      id: sampleSessionId,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      sessionId: '111fff',
      session: 'bliggatiblooop',
    }]);
    const query = `
      SELECT *
      FROM \`${dataset}.${tableName}\`
      WHERE id = '${sampleSessionId}'
    `;
    const [sessions] = await bqDataset.query({query});
    expect(sessions[0].id).toBe(sampleSessionId);
  } finally {
    try {
      if ((await bqDataset.exists())[0])
        await bqDataset.delete();
    } catch (error) {}
  }
}, 60000);