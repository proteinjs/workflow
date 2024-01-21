import { Service, serviceFactory } from '@proteinjs/service';
import { Table } from '../Table';
import { Record } from '../Record';
import { Query } from '../Query';

export const getDbService = serviceFactory<DbService>('@proteinjs/db/DbService');

export type Sort<T> = { column: keyof T, desc?: boolean, byValues?: string[] }[];

export interface DbService extends Service {
  tableExists<T extends Record>(table: Table<T>): Promise<boolean>;
  get<T extends Record>(table: Table<T>, query: Query<T>): Promise<T>;
  insert<T extends Record>(table: Table<T>, record: Omit<T, keyof Record>): Promise<T>;
  update<T extends Record>(table: Table<T>, record: Partial<T>, query?: Query<T>): Promise<number>;
  delete<T extends Record>(table: Table<T>, query: Query<T>): Promise<number>;
  query<T extends Record>(table: Table<T>, query: Query<T>, sort?: Sort<T>, window?: { start: number, end: number }): Promise<T[]>;
  getRowCount<T extends Record>(table: Table<T>, query?: Query<T>): Promise<number>;
}