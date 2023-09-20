import { Store } from 'express-session';
import { DBI } from '@proteinjs/db';
import { Session, SessionTable } from '../tables/SessionTable';
import { destroySession } from './destroySession';

export class DbSessionStore extends Store {
    private static readonly TWELVE_HOURS = 1000 * 60 * 60 * 12;

	constructor() {
        super();
        setInterval(this.sweep, DbSessionStore.TWELVE_HOURS);
	}

	get = (sessionId: string, cb: (error: any, session?: Express.SessionData|null) => void) => {
		(async () => {
            const result = await DBI.get().withSchema(DBI.databaseName()).select().from(SessionTable.name).where({ 'session_id': sessionId });
            if (result.length < 1) {
                cb(null);
                return;
            }

            return cb(null, JSON.parse(result[0].session));
        })();
	}

	set = (sessionId: string, session: Express.SessionData, cb?: (error?: any) => void) => {
        this.insertOrUpdate(sessionId, session, cb);
    }
    
    touch = (sessionId: string, session: Express.SessionData, cb?: (error?: any) => void) => {
		this.insertOrUpdate(sessionId, session, cb);
    }

    /**
     * Does not get called since request.logout is broken
     * See logout.ts
     */
	destroy = (sessionId: string, cb?: (error?: any) => void) => {
        // console.info('in destroy');
		(async () => {
            await destroySession(sessionId);
            if (cb)
                cb();
        })();
	}

    private async insertOrUpdate(sessionId: string, session: Express.SessionData, cb?: (error?: any) => void): Promise<void> {
        // Only persist authenticated sessions
        if (!session.passport?.user) {
            if (cb)
                cb();

            return;
        }

        const result = await DBI.get().withSchema(DBI.databaseName()).select().from(SessionTable.name).where({ 'session_id': sessionId });
        if (result.length > 0) {
            const sessionRecord = result[0];
            sessionRecord.session = JSON.stringify(session);
            sessionRecord.expires = (<Date>session.cookie.expires);
            sessionRecord['user_email'] = session.passport?.user;
            await DBI.get().withSchema(DBI.databaseName()).update(sessionRecord).into(SessionTable.name).where({ 'session_id': sessionId });
        } else {
            try {
                await DBI.get().withSchema(DBI.databaseName()).insert({
                    'session_id': sessionId,
                    session: JSON.stringify(session),
                    expires: (<Date>session.cookie.expires),
                    'user_email': session.passport?.user
                }).into(SessionTable.name);
            } catch (error) {
                // race condition on insert
                // console.error('Failed to create session', error);
            }
        }

        if (cb)
            cb();
    }

    private async sweep(): Promise<void> {
        if (!await DBI.get().schema.withSchema(DBI.databaseName()).hasTable(SessionTable.name))
            return;

        console.info(`Sweeping expired sessions`);
        const expiredSessions = (await DBI.get().withSchema(DBI.databaseName()).select().from<Session>(SessionTable.name).where(SessionTable.columns.expires.name, '<=', new Date())).length;
        await DBI.get().withSchema(DBI.databaseName()).delete().from(SessionTable.name).where(SessionTable.columns.expires.name, '<=', new Date());
		console.info(`Swept ${expiredSessions} expired sessions`);
	}
}