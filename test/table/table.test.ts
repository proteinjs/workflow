import { Db } from '../../src/db';
import { Table } from '../../src/table';
import { CodeGeneratorConfig } from '../../src/util/CodeGeneratorConfig';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('Create db', async () => {
  CodeGeneratorConfig.set({ srcPath: `${process.cwd()}/test/table/generated` });
  await new Db({
    dataset: 'test',
    projectId: 'test-bigquery-398804',
   }).generate();
  await delay(2000);
  // try {
  //   const response = await axios.post('http://localhost:3000/hello', { message: 'hello world' });
  //   expect(JSON.stringify(response.data)).toBe(JSON.stringify(['hello', 'world']));
  // } finally {
  //   await server.stop();
  // }
}, 60000);

// test('Create table with schema', async () => {
//   CodeGeneratorConfig.set({ srcPath: `${process.cwd()}/test/table/generated` });
//   await new Table({ 
//     name: 'session',
//     databaseName: 'test',
//     projectId: 'test-bigquery-398804',
//     columns: { 
//       id: 'string',
//       created: 'string',
//       updated: 'string',
//       sessionId: 'string',
//       session: 'string',
//     },
//    }).generate();
//   await delay(2000);
//   // try {
//   //   const response = await axios.post('http://localhost:3000/hello', { message: 'hello world' });
//   //   expect(JSON.stringify(response.data)).toBe(JSON.stringify(['hello', 'world']));
//   // } finally {
//   //   await server.stop();
//   // }
// }, 60000);