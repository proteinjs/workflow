import express, { Express } from 'express';

export interface RouteLoader {
  loadRoutes(server: Express): void;
}

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

  public static start(): void {
    const instance = Server.getInstance();
    instance.routeLoaders.forEach(loader => loader.loadRoutes(instance.server));
    instance.serverInstance = instance.server.listen(instance.port, () => {
      console.log(`Server is running on port ${instance.port}`);
    });
  }

  public static stop(): void {
    const instance = Server.getInstance();
    if (instance.serverInstance) {
      instance.serverInstance.close();
      instance.serverInstance = null;
    }
  }

  public static setPort(port: number): void {
    const instance = Server.getInstance();
    instance.port = port;
  }

  public static addRouteLoader(routeLoader: RouteLoader): void {
    const instance = Server.getInstance();
    instance.routeLoaders.push(routeLoader);
  }
}