import axios from 'axios';
import { CodeGeneratorConfig } from '../../src/util/CodeGeneratorConfig';
import { Service } from '../../src/service';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('Service should respond to basic request', async () => {
  CodeGeneratorConfig.set({ srcPath: `${process.cwd()}/test/service/generated` });
  await new Service({ 
    name: 'hello',
    functionBody: 'Split the input string on \' \' and return the split array',
    parameters: { message: 'string' },
    returnType: 'string[]'
   }).generate();
  await delay(2000);
  const server = require('../../dist/test/service/generated/server/Server.js');
  await delay(5000);
  try {
    const response = await axios.post('http://localhost:3000/hello', { message: 'hello world' });
    expect(JSON.stringify(response.data)).toBe(JSON.stringify(['hello', 'world']));
  } finally {
    await server.stop();
  }
}, 60000);