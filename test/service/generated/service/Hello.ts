import { Service } from '../serviceloader/Service';

export class Hello implements Service {
  path: string = '/hello';

  async call(args: any): Promise<any> {
    const { message } = args;
    return message.split(' ');
  }
}