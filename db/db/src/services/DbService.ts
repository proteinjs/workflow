import { Service, serviceFactory } from '@proteinjs/service';
import { Table } from '../Table';
import { Record } from '../Record';
import { QueryBuilder } from '@proteinjs/db-query';

export const getDbService = serviceFactory<DbService>('@proteinjs/db/DbService');

export type Query<T> = ObjectQuery<T> | QueryBuilder<T>
export type ObjectQuery<T> = Partial<{[P in keyof T]: any}>

export interface DbService extends Service {
  tableExists<T extends Record>(table: Table<T>): Promise<boolean>;
  get<T extends Record>(table: Table<T>, query: Query<T>): Promise<T>;
  insert<T extends Record>(table: Table<T>, record: Omit<T, keyof Record>): Promise<T>;
  update<T extends Record>(table: Table<T>, record: Partial<T>, query?: Query<T>): Promise<number>;
  delete<T extends Record>(table: Table<T>, query: Query<T>): Promise<number>;
  query<T extends Record>(table: Table<T>, query: Query<T>): Promise<T[]>;
  getRowCount<T extends Record>(table: Table<T>, query?: Query<T>): Promise<number>;
}