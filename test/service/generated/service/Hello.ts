import { Service } from '../serviceloader/Service';

export class Hello implements Service {
  path: string = '/hello';

  async call(args: { message: string }): Promise<string[]> {
    return args.message.split(' ');
  }
}