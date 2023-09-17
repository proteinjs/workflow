import express, { Express } from 'express';

export interface RouteLoader {
  loadRoutes(server: Express): void;
}

export class Server {
  private static instance: Server;
  private express: Express;
  private server: any;
  private port: number = 3000;
  private routeLoaders: RouteLoader[] = [];

  private constructor() {
    this.express = express();
    this.express.use(express.json());
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  public static start(): void {
    const instance = Server.getInstance();
    instance.routeLoaders.forEach(loader => loader.loadRoutes(instance.express));
    instance.server = instance.express.listen(instance.port, () => {
      console.log(`Server is running on port ${instance.port}`);
    });
  }

  public static stop(): void {
    const instance = Server.getInstance();
    if (instance.server) {
      instance.server.close();
      instance.server = null;
    }
  }

  public static setPort(port: number): void {
    Server.getInstance().port = port;
  }

  public static addRouteLoader(routeLoader: RouteLoader): void {
    Server.getInstance().routeLoaders.push(routeLoader);
  }
}

Server.addRouteLoader({
  loadRoutes: (server: Express) => {
    server.get('/hello', (req, res) => {
      res.send('world');
    });
  }
});

Server.start();