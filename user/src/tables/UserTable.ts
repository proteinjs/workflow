import { BooleanColumn, StringColumn, Table } from '@proteinjs/db';

export type User = {
    name: string,
    email: string,
    password: string,
    emailVerified: boolean,
    roles: string
}

export const UserTable: Table<User> = {
    name: 'user',
    columns: {
        name: new StringColumn('name'),
        email: new StringColumn('email', {}, 250),
        password: new StringColumn('password'),
        emailVerified: new BooleanColumn('email_verified'),
        roles: new StringColumn('roles')
    }
};