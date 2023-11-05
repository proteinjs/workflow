import { Query, Record, Table, getDbService } from '@proteinjs/db'
import { RowWindow, TableLoader } from '@proteinjs/ui'

export class QueryTableLoader<T extends Record> implements TableLoader<T> {
  constructor(
    private table: Table<T>,
    private query?: Query<T>,
    private sort?: { column: keyof T, desc?: boolean }[]
  ) {}

  async load(startIndex: number, endIndex: number): Promise<RowWindow<T>> {
    const dbService = getDbService();
    const query = this.query ? this.query : {};
    const sort: any = this.sort ? this.sort : [{ column: 'created', desc: true }];
    const window = { start: startIndex, end: endIndex };
    const queryPromise = dbService.query(this.table, query, sort, window);
    const rowCountPromise = dbService.getRowCount(this.table, this.query);
    const [rows, totalCount] = await Promise.all([queryPromise, rowCountPromise]);
    return { rows, totalCount };
  }
}