import { Express, Request, Response } from 'express';
import { Service } from '../Service';
import { Server, RouteLoader } from '@brentbahry/server';

export class ServiceLoader implements RouteLoader {
    private static instance: ServiceLoader;
    private services: Service[] = [];

    private constructor() {}

    public static getInstance(): ServiceLoader {
        if (!ServiceLoader.instance) {
            ServiceLoader.instance = new ServiceLoader();
        }
        return ServiceLoader.instance;
    }

    public static loadService(service: Service): void {
        ServiceLoader.getInstance().services.push(service);
    }

    public loadRoutes(server: Express): void {
        this.services.forEach(service => {
            server.all(service.path, async (req: Request, res: Response) => {
                try {
                    const result = await service.call(req.body);
                    res.send(result);
                } catch (error: any) {
                    res.status(500).send(error);
                }
            });
        });
    }
}

Server.addRouteLoader(ServiceLoader.getInstance());