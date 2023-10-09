import { Interface, Method } from '@brentbahry/reflection';
import { Service } from './Service';
import { Logger } from '@brentbahry/util';
import { Serializer } from '@proteinjs/serializer';

export class ServiceExecutor {
  private logger: Logger;
  constructor(
    private service: Service,
    private _interface: Interface,
    private method: Method,
  ) {
    this.logger = new Logger(`${_interface.name}.${method.name}`);
  }

  async execute(requestBody: any): Promise<any> {
    this.logger.info(`Executing request`);
    const method = this.service[this.method.name].bind(this.service);
    const deserializedArgs = Serializer.deserialize(requestBody);
    const _return = await method(...deserializedArgs);
    const serializedReturn = Serializer.serialize(_return);
    this.logger.info(`Returning response`);
    return serializedReturn;
  }
}