import express, { Express } from 'express';
import { Server as HttpServer } from 'http';

type RouteLoader = (server: Express) => void;

class Server {
  private static instance: Server;
  private server?: HttpServer;
  private port: number = 3000;
  private routeLoaders: RouteLoader[] = [];
  private app: Express = express();

  private constructor() {
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
      console.log(`Server started on port ${this.port}`);
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

const server = Server.getInstance();

server.addRouteLoader((app: Express) => {
  app.get('/hello', (req, res) => {
    res.send('world');
  });
});

server.start();