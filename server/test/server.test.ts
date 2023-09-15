import axios from 'axios';
import { Server } from '../src/Server';

test('Server should respond to basic request', async () => {
  await new Server({ 
    srcPath: `${process.cwd()}/test/server/generated`,
    additionalInstructions: `Register a GET route with the server on path hello that responds with the string world.` 
  }).generate();
  const server = require('../../dist/test/server/generated/server/Server.js');
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await delay(5000);
  const response = await axios.get('http://localhost:3000/hello');
  await server.stop();
  expect(response.data).toBe('world');
}, 60000);