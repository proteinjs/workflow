import sha256 from 'crypto-js/sha256';
import { DBI } from '@proteinjs/db';
import { User, UserTable } from '../tables/UserTable';
import { DefaultAdminCredentials } from './DefaultAdminCredentials';

export function createAuthentication(defaultAdminCredentials?: { username: string, password: string }) {
    if (defaultAdminCredentials)
        DefaultAdminCredentials.setCredentials(defaultAdminCredentials);

    return authenticate;
}

export async function authenticate(email: string, password: string): Promise<true|string> {
    const defaultAdminCredentials = DefaultAdminCredentials.getCredentials();
    if (defaultAdminCredentials && defaultAdminCredentials.username == email && defaultAdminCredentials.password == password) {
        console.info('Authenitcated default admin user');
        return true;
    }

    const result = await DBI.get().withSchema(DBI.databaseName()).select().from(UserTable.name).where({
        email,
        password: sha256(password).toString()
    }) as User[];
    if (result.length < 1)
        return 'User name or password incorrect';

    return true;
};