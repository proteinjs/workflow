import { DateTimeColumn, UuidColumn } from './Columns';
import { Column, Table, Columns } from './Table';
import moment from 'moment';

export interface Record {
	id: string;
	created: moment.Moment;
	updated: moment.Moment;
}

export const recordColumns: Columns<Record> = {
  id: new UuidColumn('id'),
  created: new DateTimeColumn('created', { defaultValue: async () => moment() }),
  updated: new DateTimeColumn('updated', { updateValue: async () => moment() }),
}

export function withRecordColumns<T extends Record>(columns: Columns<Omit<T, keyof Record>>): Columns<Record> & Columns<Omit<T, keyof Record>> {
  return Object.assign(Object.assign({}, recordColumns), columns);
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
      let column = columns[columnName];
      if (column) {
        let value = row[columnName];
        await this.deserializeField(deserialized, column, columnName, value);
        continue;
      }

      for (let columnPropertyName in this.table.columns) {
        column = (this.table.columns as any)[columnPropertyName];
        if (column && columnName == column.name) {
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