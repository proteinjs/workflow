import express, { Express } from 'express';

export interface RouteLoader {
  loadRoutes(server: Express): void;
}

export class Server {
  private static instance: Server;
  private server: Express;
  private port: number;
  private routeLoaders: RouteLoader[] = [];
  private serverInstance: any;

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
    const server = Server.getInstance();
    server.routeLoaders.forEach(loader => loader.loadRoutes(server.server));
    server.serverInstance = server.server.listen(server.port, () => {
      console.log(`Server is running on port ${server.port}`);
    });
  }

  public static stop(): void {
    const server = Server.getInstance();
    if (server.serverInstance) {
      server.serverInstance.close();
      server.serverInstance = null;
    }
  }

  public static setPort(port: number): void {
    const server = Server.getInstance();
    server.port = port;
  }

  public static addRouteLoader(routeLoader: RouteLoader): void {
    const server = Server.getInstance();
    server.routeLoaders.push(routeLoader);
  }
}