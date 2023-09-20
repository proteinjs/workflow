import { Route } from '@proteinjs/server-api';
import { destroySession } from '../authentication/destroySession';

export const logout: Route = {
    path: '/user/logout',
    method: 'get',
    onRequest: async (request: any, response): Promise<void> => {
        // request.logout();
        // await request.session.destroy();
        // await new Promise((resolve, reject) => {
        //     request.session?.destroy((error: any) => {
        //         if (error) {
        //             reject(error);
        //             return;
        //         }

        //         resolve();
        //     });
        // });
        // delete request._passport?.session?.user;
        // console.info(`request.sessionID: ${request.sessionID}`);
        // console.info(`request.session?.id: ${request.session?.id}`);
        await destroySession(request.sessionID);
        request.session.passport.user = null;
        response.redirect('/login');
    }
}