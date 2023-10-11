import { Service, serviceFactory } from '@proteinjs/service';
import { Table } from '../Table';
import { Record } from '../Record';
import { Query } from '../Query';

export const getDbService = serviceFactory<DbService>('@proteinjs/db/DbService');

export interface DbService extends Service {
  tableExists<T extends Record>(table: Table<T>): Promise<boolean>;
  get<T extends Record>(table: Table<T>, query: Query<T>): Promise<T>;
  insert<T extends Record>(table: Table<T>, record: Omit<T, keyof Record>): Promise<T>;
  update<T extends Record>(table: Table<T>, record: Partial<T>, query?: Query<T>): Promise<void>;
  delete<T extends Record>(table: Table<T>, query: Query<T>): Promise<void>;
  query<T extends Record>(table: Table<T>, query: Query<T>): Promise<T[]>;
}