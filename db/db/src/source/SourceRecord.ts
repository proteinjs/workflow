import { Loadable, SourceRepository } from '@brentbahry/reflection';
import { Columns, Table } from '../Table';
import { Record as DbRecord, withRecordColumns } from '../Record';
import { BooleanColumn } from '../Columns';

export const getSourceRecordLoaders = () => SourceRepository.get().objects<SourceRecordLoader<any>>('@proteinjs/db/SourceRecordLoader');

export interface SourceRecord extends DbRecord {
  isLoadedFromSource?: boolean;
}

export const sourceRecordColumns = {
  isLoadedFromSource: new BooleanColumn('is_loaded_from_source'),
}

/**
 * Wrapper function to add default Record and SourceRecord columns to your table's columns.
 * 
 * Note: using this requires an explicit dependency on moment@2.29.4 in your package (since transient dependencies are brittle by typescript's standards)
 * 
 * @param columns your columns
 * @returns recordColumns & sourceRecordColumns & your columns
 */
export function withSourceRecordColumns<T extends SourceRecord>(columns: Columns<Omit<T, keyof SourceRecord>>): Columns<SourceRecord> & Columns<Omit<T, keyof SourceRecord>> {
  return Object.assign(Object.assign({}, sourceRecordColumns), withRecordColumns<DbRecord>(columns) as any);
}

type InferRecordFromTable<T> = T extends Table<infer R> ? R : never;
type InferRecordWithoutTimestamps<T> = Omit<InferRecordFromTable<T>, 'created'|'updated'>;
type RequiredProperties<T> = Pick<T, {
  [K in keyof T]: T extends Record<K, T[K]> ? K : never
}[keyof T]>;
type OptionalProperties<T> = Pick<T, {
  [K in keyof T]: T extends Record<K, T[K]> ? never : K
}[keyof T]>;

/**
 * Use this to load a record from source into the db.
 * 
 * On Db.init, the record will be inserted if it doesn't exist, and updated if it does exist to mirror what is in source.
 * 
 * If the SourceRecordLoader is deleted from source, the record will be deleted from the db on server startup. This will also be the behavior if id is changed - the record with the old id will be deleted.
 */
export interface SourceRecordLoader<T extends SourceRecord> extends Loadable {
  table: Table<T>,
  record: {
    [P in keyof RequiredProperties<InferRecordWithoutTimestamps<Table<T>>>]: RequiredProperties<InferRecordWithoutTimestamps<Table<T>>>[P];
  } & {
    [P in keyof OptionalProperties<InferRecordWithoutTimestamps<Table<T>>>]?: OptionalProperties<InferRecordWithoutTimestamps<Table<T>>>[P];
  }
}