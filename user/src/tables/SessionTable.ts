import { DateColumn, StringColumn, Table } from '@proteinjs/db';

export type Session = {
    sessionId: string,
    session: string,
    expires: Date,
    userEmail: string
}

export const SessionTable: Table<Session> = {
    name: 'session',
    columns: {
        sessionId: new StringColumn('session_id'),
        session: new StringColumn('session', {}, 4000),
        expires: new DateColumn('expires'),
        userEmail: new StringColumn('user_email')
    }
};