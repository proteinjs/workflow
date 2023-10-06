import { DateTimeColumn, StringColumn } from './Columns';
import { Column, Table } from './Table';

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

  async serialize(record: any): Promise<Row> {
    const serialized: any = {};
    const columns: {[prop: string]: Column<any, any>} = this.table.columns;
    for (let prop in record) {
      const column = columns[prop];
      let value = await record[prop];
      if (column.serialize)
        value = await column.serialize(value, this.table, record, prop);
      serialized[column.name] = value;
    }
    return serialized;
  }

  async deserialize(row: Row): Promise<T> {
    const deserialized: any = {};
    for (let columnName in row) {
      const columns: {[prop: string]: Column<any, any>} = this.table.columns;
      if (columns[columnName]) {
        const column = columns[columnName];
        let value = row[columnName];
        await this.deserializeField(deserialized, column, columnName, value);
        continue;
      }

      for (let columnPropertyName in this.table.columns) {
        const column = this.table.columns[columnPropertyName];
        if (columnName == column.name) {
          const value = row[columnName];
          await this.deserializeField(deserialized, column, columnPropertyName, value);
          break;
        }
      }
    }
    return deserialized;
  }

  private async deserializeField(deserialized: any, column: Column<any, any>, propertyName: string, propertyValue: any) {
    if (!column.deserialize) {
      deserialized[propertyName] = propertyValue;
      return;
    }
    
    const deservialedValue = await column.deserialize(propertyValue, this.table, deserialized, propertyName);
    if (typeof deservialedValue !== 'undefined') {
      deserialized[propertyName] = deservialedValue;
    }
  }
}