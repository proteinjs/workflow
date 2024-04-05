import { Interface, Method } from '@brentbahry/reflection';
import { Service } from './Service';
import { Logger } from '@brentbahry/util';
import { Serializer } from '@proteinjs/serializer';

export class ServiceExecutor {
  private logger: Logger;
  constructor(
    public service: Service,
    private _interface: Interface,
    private method: Method,
  ) {
    this.logger = new Logger(`${_interface.name}.${method.name}`, undefined, 2500);
  }

  async execute(requestBody: any): Promise<any> {
    this.logger.info(`Executing with args:\n${JSON.stringify(requestBody, null, 2)}`);
    const method = this.service[this.method.name].bind(this.service);
    const deserializedArgs = Serializer.deserialize(requestBody);
    let _return: any;
    try {
      if (this.service.serviceMetadata?.doNotAwait)
        method(...deserializedArgs);
      else
        _return = await method(...deserializedArgs);
    } catch (error: any) {
      this.logger.error(`Failed with args:\n${JSON.stringify(requestBody, null, 2)}`);
      throw error;
    }
    const serializedReturn = Serializer.serialize(_return);
    this.logger.info(`Returning:\n${serializedReturn}`);
    return serializedReturn;
  }
}