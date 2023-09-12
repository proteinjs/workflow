import { Service } from './Service';
import express, { Request, Response } from 'express';
import { Hello } from '../service/Hello';

const services: Service[] = [
  new Hello(),
  // Add other service instances here
];

export function loadServices(server: express.Application): void {
  services.forEach(service => {
    server.post(service.path, async (req: Request, res: Response) => {
      try {
        const result = await service.call(req.body);
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });
  });
}