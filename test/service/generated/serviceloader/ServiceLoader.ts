import { Service } from './Service';
import { Hello } from '../service/Hello';

const services: Service[] = [
  new Hello(),
];

export function loadServices(server: any): void {
  services.forEach(service => {
    server.post(service.path, async (req: any, res: any) => {
      try {
        const result = await service.call(req.body);
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });
  });
}