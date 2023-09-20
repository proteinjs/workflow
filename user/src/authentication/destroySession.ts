import { DBI } from '@proteinjs/db';
import { SessionTable } from '../tables/SessionTable';

export async function destroySession(sessionId?: string) {
    if (!sessionId)
        return;

    await DBI.get().withSchema(DBI.databaseName()).select().from(SessionTable.name).where({ 'session_id': sessionId }).del();
}