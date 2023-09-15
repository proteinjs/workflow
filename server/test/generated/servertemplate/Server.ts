import express, { Express } from 'express';

export class Server {
  private static instance: Server;
  private app: Express;
  private server: any;
  private port: number = 3000;
  private routeLoaders: Array<(server: Express) => void> = [];

  private constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  public start(): void {
    this.routeLoaders.forEach(loader => loader(this.app));
    this.server = this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  public stop(): void {
    this.server.close();
  }

  public setPort(port: number): void {
    this.port = port;
  }

  public addRouteLoader(loader: (server: Express) => void): void {
    this.routeLoaders.push(loader);
  }
}

const server = Server.getInstance();

server.addRouteLoader((app: Express) => {
  app.get('/hello', (req, res) => {
    res.send('world');
  });
});

server.start();