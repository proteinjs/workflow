import { DateTimeColumn, StringColumn } from './Columns';
import { Table } from './Table';

export interface Record {
	id: string;
	created: string;
	updated: string;
}

export const recordColumns = {
  id: new StringColumn('id'),
  created: new DateTimeColumn('created'),
  updated: new DateTimeColumn('updated'),
}

export function withRecordColumns(columns: any) {
  return Object.assign(recordColumns, columns);
}

export type Row = { [columnName: string]: any }

export class RecordSerializer<T extends Record> {
  private table: Table<T>;
  
	constructor(table: Table<T>) {
    this.table = table;
  }

  serialize(record: any): Row {
    const serialized: any = {};
    const columns: any = this.table.columns;
    for (let prop in record) {
      const column = columns[prop];
      serialized[column.name] = record[prop];
    }
    return serialized;
  }

  deserialize(row: Row): T {
    const deserialized: any = {};
    for (let columnName in row) {
      const columns: any = this.table.columns;
      if (columns[columnName]) {
        deserialized[columnName] = row[columnName];
        continue;
      }

      for (let columnPropertyName in this.table.columns) {
        if (columnName == this.table.columns[columnPropertyName].name) {
          deserialized[columnPropertyName] = row[columnName];
          break;
        }
      }
    }
    return deserialized;
  }
}