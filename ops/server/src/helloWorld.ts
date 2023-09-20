import { Route } from '@proteinjs/server-api';

export const helloWorld: Route = {
    path: 'hello',
    method: 'get',
    onRequest: async (request, response): Promise<void> => {
        response.send(`Hello, ${request.user}`);
    }
}