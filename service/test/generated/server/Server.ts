import express, { Express } from 'express';
import { Server } from 'http';
import { loadServices } from '../serviceloader/ServiceLoader';

const app: Express = express();
app.use(express.json());

loadServices(app);

const server: Server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

export function stop(): void {
  server.close();
}