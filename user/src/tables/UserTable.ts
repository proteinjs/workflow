import { BooleanColumn, StringColumn, Table, Record, withRecordColumns } from '@proteinjs/db';

export type User = Record & {
    name: string,
    email: string,
    password: string,
    emailVerified: boolean,
    roles: string
}

export const UserTable: Table<User> = {
    name: 'user',
    columns: withRecordColumns({
        name: new StringColumn('name'),
        email: new StringColumn('email', {}, 250),
        password: new StringColumn('password'),
        emailVerified: new BooleanColumn('email_verified'),
        roles: new StringColumn('roles'),
    })
};