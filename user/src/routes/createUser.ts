import sha256 from 'crypto-js/sha256';
import { Route } from '@proteinjs/server-api';
import { Db } from '@proteinjs/db';
import { User, UserTable } from '../tables/UserTable';

export const createUser: Route = {
    path: '/user/create',
    method: 'post',
    onRequest: async (request, response): Promise<void> => {
        const user = request.body as User;
        const userRecord = await Db.get(UserTable, { email: user.email });
        if (userRecord) {
            const error = `User with this email already exists`;
            console.error(`${error}: ${user.email}`);
            response.send({ error });
            return;
        }

        await Db.insert(UserTable, {
            name: user.name,
            email: user.email,
            password: sha256(user.password).toString(),
            emailVerified: false,
            roles: '',
        });
        console.info(`Created user: ${user.email}`);
        response.send({});
    }
}