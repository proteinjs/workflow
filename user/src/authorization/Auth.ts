import { Session } from '@proteinjs/server-api';
import { guestUser, userCache } from './userCache';

export class Auth {
    static isLoggedIn(): boolean {
        const user = Session.getData(userCache);
        return user.email != guestUser.email;
    }

    /**
     * @return true if user has role or user has role 'admin'
     */
    static hasRole(role: string): boolean {
        const user = Session.getData(userCache);
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