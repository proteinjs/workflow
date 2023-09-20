import sha256 from 'crypto-js/sha256';
import { Route } from '@proteinjs/server-api';
import { DBI } from '@proteinjs/db';
import { User, UserTable } from '../tables/UserTable';

export const createUser: Route = {
    path: '/user/create',
    method: 'post',
    onRequest: async (request, response): Promise<void> => {
        const user = request.body as User;
        const result = await DBI.get().withSchema(DBI.databaseName()).select().from(UserTable.name).where({ email: user.email });
        if (result.length > 0) {
            const error = `User with this email already exists`;
            console.error(`${error}: ${user.email}`);
            response.send({ error });
            return;
        }

        await DBI.get().withSchema(DBI.databaseName()).insert({
            name: user.name,
            email: user.email,
            password: sha256(user.password).toString()
        }).into(UserTable.name);
        console.info(`Created user: ${user.email}`);
        response.send({});
    }
}