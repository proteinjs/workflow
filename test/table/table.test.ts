import { BigQuery } from '@google-cloud/bigquery';
import { Db } from '../../src/db';
import { Table } from '../../src/table';
import { CodeGeneratorConfig } from '../../src/util/CodeGeneratorConfig';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('Create dataset and table', async () => {
  CodeGeneratorConfig.set({ srcPath: `${process.cwd()}/test/table/generated` });
  const tableName = 'session';
  const dataset = 'test';
  const projectId = 'test-bigquery-398804';
  await new Table({
    name: tableName,
    dataset,
    projectId,
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
    expect(await bqDataset.exists()).toBeTruthy(); 
    const table = bqDataset.table(tableName);
    expect(await table.exists()).toBeTruthy();
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
      if (await bqDataset.exists())
        await bqDataset.delete();
    } catch (error) {}
  }
}, 60000);