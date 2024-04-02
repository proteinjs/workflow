import { Columns, StringColumn, Record, withRecordColumns, getDb } from '@proteinjs/db';
import { Session } from '@proteinjs/server-api';
import { User } from './tables/UserTable';
import { USER_SESSION_CACHE_KEY } from './cacheKeys';

export interface ScopedRecord extends Record {
  scope: string;
}

export const getScopedDb = getDb<ScopedRecord>;

const scopedRecordColumns = {
  scope: new StringColumn('scope', { 
    defaultValue: async () =>  Session.getData<User>(USER_SESSION_CACHE_KEY).id,
    addToQuery: async (qb) => { 
      qb.condition({ 
        field: 'scope', 
        operator: 'IN', 
        value: [Session.getData<User>(USER_SESSION_CACHE_KEY).id]
      });
    },
    ui: { hidden: true },
  }),
}

/**
 * Wrapper function to add default ScopedRecord columns to your table's columns.
 * 
 * Note: using this requires an explicit dependency on moment@2.29.4 in your package (since transient dependencies are brittle by typescript's standards)
 * 
 * @param columns your columns
 * @returns recordColumns & sourceRecordColumns & your columns
 */
export function withScopedRecordColumns<T extends ScopedRecord>(columns: Columns<Omit<T, keyof ScopedRecord>>): Columns<ScopedRecord> & Columns<Omit<T, keyof ScopedRecord>> {
  return Object.assign(Object.assign({}, scopedRecordColumns), withRecordColumns<Record>(columns) as any);
}