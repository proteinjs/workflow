import axios from 'axios';
import { ServiceTemplate } from '../src/ServiceTemplate';
import { ServiceLoaderTemplate } from '../src/ServiceLoaderTemplate';
import { Service } from '../src/Service';
import { ServiceLoader } from '../src/generated/ServiceLoader';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('Service should respond to basic request', async () => {
  await new ServiceTemplate({ 
    srcPath: `${process.cwd()}/test/generated`,
    name: 'hello',
    functionBody: 'Split the input string on \' \' and return the split array',
    parameters: { message: 'string' },
    returnType: 'string[]',
    additionalInstructions: [
      'export { Server, Hello } at the end and change \'export class\' to \'class\'',
      'Add a call to Server.start() at the end',
    ],
    additionalPackages: [
      { name: '@brentbahry/server', version: '../server', exactVersion: false },
    ],
    replacePackages: true,
    additionalImports: [
      { moduleNames: ['Service'], importPathFromGeneratedFile: '../../src/Service', sourceFilePath: require.resolve('../src/Service.ts') },
      { moduleNames: ['ServiceLoader'], importPathFromGeneratedFile: '../../src/generated/ServiceLoader', sourceFilePath: require.resolve('../src/generated/ServiceLoader.ts') },
      { moduleNames: ['Server'], importPathFromGeneratedFile: '@brentbahry/server', sourceFilePath: require.resolve('@brentbahry/server/src/generated/Server.ts') },
    ],
    replaceImports: true,
   }).generate();
  await delay(5000);
  const Server = require('../dist/test/generated/Hello.js')['Server'];
  await delay(5000);
  try {
    const response = await axios.post('http://localhost:3000/hello', { message: 'hello world' });
    expect(JSON.stringify(response.data)).toBe(JSON.stringify(['hello', 'world']));
  } finally {
    if (Server)
      await Server.stop();
  }
}, 60000);

// test('Create ServiceLoader', async () => {
//   await new ServiceLoaderTemplate({ 
//     srcPath: `${process.cwd()}/src/generated`,
//    }).generate();
// }, 60000);