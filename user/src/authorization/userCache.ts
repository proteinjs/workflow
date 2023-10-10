import moment from 'moment';
import { SessionDataCache } from '@proteinjs/server-api';
import { Db } from '@proteinjs/db';
import { User } from '../tables/UserTable';
import { tables } from '../tables/tables';
import { DefaultAdminCredentials } from '../authentication/DefaultAdminCredentials';

export const guestUser: User = {
    name: 'Guest',
    email: 'guest',
    password: 'guest',
    emailVerified: false,
    roles: '',
    created: moment(),
    updated: moment(),
    id: '',
};
export const userCache: SessionDataCache<User> = {
    key: '@proteinjs/user/userCache',
    create: async (sessionId: string, userEmail: string): Promise<User> => {
        let user = guestUser;
        if (userEmail) {
            const adminCredentials = DefaultAdminCredentials.getCredentials();
            if (userEmail == adminCredentials.username) {
                const adminUser: User = { name: 'Admin', email: adminCredentials.username, password: adminCredentials.password, emailVerified: true, roles: 'admin', created: moment(), updated: moment(), id: '' };
                user = adminUser;
            } else {
                user = await new Db().get(tables.User, { email: userEmail });
            }
        }

        return user;
    }
}