import { Session } from '@proteinjs/server-api';
import { USER_SESSION_CACHE_KEY, User, guestUser } from '@proteinjs/user';

export class Auth {
    static isLoggedIn(): boolean {
        const user = Session.getData<User>(USER_SESSION_CACHE_KEY);
        return user.email != guestUser.email;
    }

    /**
     * @return true if user has role or user has role 'admin'
     */
    static hasRole(role: string): boolean {
        const user = Session.getData<User>(USER_SESSION_CACHE_KEY);
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
}