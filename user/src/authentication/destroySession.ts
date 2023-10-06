import { Db } from '@proteinjs/db';
import { SessionTable } from '../tables/SessionTable';

export async function destroySession(sessionId?: string) {
    if (!sessionId)
        return;

    await Db.delete(SessionTable, { sessionId });
}