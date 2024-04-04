import { Session } from '@proteinjs/server-api';
import { User } from './tables/UserTable';
import { USER_SESSION_CACHE_KEY } from './cacheKeys';
import { guestUser } from './guestUser';

export class Auth {
    static isLoggedIn(): boolean {
        const user = Auth.getUser();
        return user.email != guestUser.email;
    }

    /**
     * @return true if user has role or user has role 'admin'
     */
    static hasRole(role: string): boolean {
        const user = Auth.getUser();
        const roles = user.roles ? user.roles.split(',') : [];
        if (roles.includes('admin'))
            return true;

        return roles.includes(role);
    }

    /**
     * @return true if user has all roles
     */
    static hasRoles(roles: string[]): boolean {
        for (const role of roles) {
            if (!Auth.hasRole(role))
                return false;
        }

        return true;
    }

    static getUser(): User {
        return Session.getDataByKey<User>(USER_SESSION_CACHE_KEY);
    }

    static setUser(user: User) {
        Session.setDataByKey(USER_SESSION_CACHE_KEY, user);
    }
}