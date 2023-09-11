import express, { Express, Request, Response } from 'express';
import { loadServices } from '../serviceloader/ServiceLoader';

const app: Express = express();
const port: number = 3000;

app.use(express.json());

loadServices(app);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export const stop = (): void => {
  server.close();
};