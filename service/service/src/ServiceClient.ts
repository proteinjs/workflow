import { Serializer } from '@proteinjs/serializer';
import { Logger } from '@brentbahry/util';

export class ServiceClient {
  private logger = new Logger(this.constructor.name, 'info', 1000);

  constructor(
    private servicePath: string,
  ) {}

  async send(...args: any[]): Promise<any> {
    const serializedArgs = Serializer.serialize(args);
    this.logger.info(`Sending service request: ${this.servicePath}, args:\n${serializedArgs}`);
    const _return = await this._send(this.servicePath, serializedArgs);
    this.logger.info(`Received service response: ${this.servicePath}, return:\n${JSON.stringify(_return, null, 2)}`);
    return Serializer.deserialize(_return);
  }

  private async _send(absoluteUrl: string, serializedArgs: string) {
    const request = new Request(absoluteUrl, {
			method: 'POST',
			body: serializedArgs,
			redirect: 'follow',
			credentials: 'same-origin',
			headers: {
        'Content-Type': 'application/json',
      },
		});
    const response = await fetch(request);
    if (response.status != 200)
      throw new Error(`Failed to login, error: ${response.statusText}`);
    
    const body = await response.json();
    if (body.error)
        throw new Error(body.error);
    
    return body;
  }
}