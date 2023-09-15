import express, { Express } from 'express';
import { Server as HttpServer } from 'http';

type RouteLoader = (server: Express) => void;

class Server {
  private static instance: Server;
  private server?: HttpServer;
  private app: Express;
  private port: number = 3000;
  private routeLoaders: RouteLoader[] = [];

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
    if (this.server) {
      this.server.close();
    }
  }

  public setPort(port: number): void {
    this.port = port;
  }

  public addRouteLoader(loader: RouteLoader): void {
    this.routeLoaders.push(loader);
  }
}

export { Server };