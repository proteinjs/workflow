import { SessionDataCache } from '@proteinjs/server-api';
import { DBI } from '@proteinjs/db';
import { User, UserTable } from '../tables/UserTable';

export const guestUser: User = {
    name: 'Guest',
    email: 'guest',
    password: 'guest',
    emailVerified: false,
    roles: ''
};
export const userCache: SessionDataCache<User> = {
    key: '@proteinjs/user/userCache',
    create: async (sessionId: string, userEmail: string): Promise<User> => {
        let user = guestUser;
        if (userEmail) {
            const result = await DBI.get().withSchema(DBI.databaseName()).select().from(UserTable.name).where({ email: userEmail });
            user = result[0];
        }

        return user;
    }
}