import { SessionDataCache } from '@proteinjs/server-api';
import { Db } from '@proteinjs/db';
import { User, UserTable } from '../tables/UserTable';
import { DefaultAdminCredentials } from '../authentication/DefaultAdminCredentials';

export const guestUser: User = {
    name: 'Guest',
    email: 'guest',
    password: 'guest',
    emailVerified: false,
    roles: '',
    created: '',
    updated: '',
    id: '',
};
export const userCache: SessionDataCache<User> = {
    key: '@proteinjs/user/userCache',
    create: async (sessionId: string, userEmail: string): Promise<User> => {
        let user = guestUser;
        if (userEmail) {
            const adminCredentials = DefaultAdminCredentials.getCredentials();
            if (userEmail == adminCredentials.username) {
                const adminUser: User = { name: 'Admin', email: adminCredentials.username, password: adminCredentials.password, emailVerified: true, roles: 'admin', created: '', updated: '', id: '' };
                user = adminUser;
            } else {
                user = await Db.get(UserTable, { email: userEmail });
            }
        }

        return user;
    }
}