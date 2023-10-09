import { Route } from '@proteinjs/server-api';
import { Service } from './Service';
import { Interface, SourceRepository } from '@brentbahry/reflection';
import { ServiceExecutor } from './ServiceExecutor';
import { Logger } from '@brentbahry/util';

export class ServiceRouter implements Route {
  private logger = new Logger(this.constructor.name);
  private serviceExecutorMap: {[path: string]: ServiceExecutor}|undefined;
  path = 'service/*';
  method: 'post' = 'post';

  private getServiceExecutorMap() {
    if (!this.serviceExecutorMap) {
      this.serviceExecutorMap = {};
      const serviceTypes = SourceRepository.get().baseChildren('@proteinjs/service/Service');
      for (let serviceType of serviceTypes) {
        if (!(serviceType instanceof Interface))
          continue;

        const service = SourceRepository.get().object<Service>(serviceType.qualifiedName);
        for (let method of serviceType.methods) {
          const servicePath = `/service/${serviceType.qualifiedName}/${method.name}`;
          this.serviceExecutorMap[servicePath] = new ServiceExecutor(service, serviceType, method);
        }
      }
    }

    return this.serviceExecutorMap;
  }

  async onRequest(request: any, response: any): Promise<any> {
      const serviceExecutor = this.getServiceExecutorMap()[request.route];
      if (!serviceExecutor) {
        const error = `Unable to find service matching path: ${request.route}`;
        this.logger.error(error);
        response.send({ error });
        return;
      }

      try {
        const serializedReturn = await serviceExecutor.execute(request.body);
        response.send(serializedReturn);
      } catch (error: any) {
        response.status(500).send(error.message);
      }
  }
}