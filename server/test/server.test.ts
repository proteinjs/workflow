import axios from 'axios';
import { ServerTemplate } from '../src/ServerTemplate';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// test('Server should respond to basic request', async () => {
//   await new ServerTemplate({ 
//     srcPath: `${process.cwd()}/test/generated`,
//     additionalInstructions: `Outside of the Server class, register a GET route with the server on path hello that responds with the string world. Start the server.` 
//   }).generate();
//   const Server = require('../dist/test/generated/ServerTemplate/Server.js')['Server'];
//   await delay(5000);
//   const response = await axios.get('http://localhost:3000/hello');
//   Server.getInstance().stop();
//   expect(response.data).toBe('world');
// }, 60000);

test('Generate server', async () => {
  await new ServerTemplate({ 
    srcPath: `${process.cwd()}/src/generated`,
  }).generate();
}, 60000);