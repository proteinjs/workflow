import { Service } from '../../src/Service';
import { ServiceLoader } from '../../src/generated/ServiceLoader';
import { Server } from '@brentbahry/server';

class Hello implements Service {
    path: string = '/hello';

    call(args: { message: string }): Promise<string[]> {
        const splitArray = args.message.split(' ');
        return Promise.resolve(splitArray);
    }
}

ServiceLoader.loadService(new Hello());
Server.start();
export { Server, Hello };