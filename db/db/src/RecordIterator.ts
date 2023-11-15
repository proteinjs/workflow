import { Db, getDb } from './Db';
import { Query } from './Query';
import { Table } from './Table';
import { Record } from './Record';
import { Sort } from './services/DbService';

export class RecordIterator<T extends Record> implements AsyncIterable<T> {
  private db: Db;
  private table: Table<T>;
  private query: Query<T>;
  private sort?: Sort<T>;
  private pageSize: number;
  private currentPage: number;

  constructor(table: Table<T>, query: Query<T>, sort?: Sort<T>, pageSize: number = 10) {
      this.db = getDb();
      this.table = table;
      this.query = query;
      this.sort = sort;
      this.pageSize = pageSize;
      this.currentPage = 0;
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
      while (true) {
          const window = { start: this.currentPage * this.pageSize, end: (this.currentPage + 1) * this.pageSize - 1 };
          const results = await this.db.query(this.table, this.query, this.sort, window);

          if (results.length === 0) {
              return;
          }

          for (const item of results) {
              yield item;
          }

          if (results.length < this.pageSize) {
              return;
          }

          this.currentPage++;
      }
  }
}
