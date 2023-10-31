import { Express } from 'express';
import { Service } from '../../src/Service';
import { ServiceLoader } from '../../src/generated/ServiceLoader';
import { Server } from '@brentbahry/server';

class Hello implements Service {
    path: string = '/hello';
    call: (args: {message: string}) => Promise<string[]> = async ({message}) => {
        return message.split(' ');
    };
}

ServiceLoader.loadService(new Hello());

Server.start();

export { Server, Hello };