import express, { Express } from 'express';

export type RouteLoader = (server: Express) => void;

export class Server {
  private static instance: Server;
  private server: Express;
  private serverInstance: any;
  private port: number;
  private routeLoaders: RouteLoader[] = [];

  private constructor() {
    this.server = express();
    this.server.use(express.json());
    this.port = 3000;
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  public setPort(port: number): void {
    this.port = port;
  }

  public addRouteLoader(routeLoader: RouteLoader): void {
    this.routeLoaders.push(routeLoader);
  }

  public start(): void {
    this.routeLoaders.forEach((loader) => loader(this.server));
    this.serverInstance = this.server.listen(this.port);
  }

  public stop(): void {
    this.serverInstance.close();
  }
}

const server = Server.getInstance();
server.addRouteLoader((server: Express) => {
  server.get('/hello', (req, res) => {
    res.send('world');
  });
});
server.start();