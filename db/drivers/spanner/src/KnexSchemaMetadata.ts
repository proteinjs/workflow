import { Table } from '@proteinjs/db';
import { SpannerDriver } from './SpannerDriver';
import { SchemaMetadata } from '@proteinjs/db/src/schema/Schema';

export class KnexSchemaMetadata implements SchemaMetadata {
  constructor(
    private knexDriver: SpannerDriver
  ){}

  async tableExists(table: Table<any>): Promise<boolean> {
		return await this.knexDriver.getSpanner().schema.withSchema(this.knexDriver.getDbName()).hasTable(table.name);
	}

  async columnExists(columnName: string, table: Table<any>): Promise<boolean> {
    const result = await this.knexDriver.getSpanner().withSchema('INFORMATION_SCHEMA').select().from('COLUMNS').where({
      'TABLE_SCHEMA': this.knexDriver.getDbName(),
      'TABLE_NAME': table.name,
      'COLUMN_NAME': columnName
    });
    return result.length > 0;
  }
  
  async getColumnMetadata(table: Table<any>) {
    const result = await this.knexDriver.getSpanner().withSchema('INFORMATION_SCHEMA').select().from('COLUMNS').where({
      'TABLE_SCHEMA': this.knexDriver.getDbName(),
      'TABLE_NAME': table.name
    });
    const columnMetadata: {[columnName: string]: any} = {};
    for (const row of result)
      columnMetadata[row['COLUMN_NAME']] = row;
  
    return columnMetadata;
  }
  
  async getPrimaryKey(table: Table<any>) {
    const result = await this.knexDriver.getSpanner().withSchema('INFORMATION_SCHEMA').select().from('KEY_COLUMN_USAGE').where({
      'TABLE_SCHEMA': this.knexDriver.getDbName(),
      'TABLE_NAME': table.name,
      'CONSTRAINT_NAME': 'PRIMARY'
    });
    const primaryKey: string[] = [];
    for (const row of result)
      primaryKey.push(row['COLUMN_NAME']);
  
    return primaryKey;
  }
  
  async getForeignKeys(table: Table<any>) {
    const result = await this.knexDriver.getSpanner().withSchema('INFORMATION_SCHEMA').select().from('KEY_COLUMN_USAGE').where({
      'TABLE_SCHEMA': this.knexDriver.getDbName(),
      'TABLE_NAME': table.name
    });
    const foreignKeys: {[columnName: string]: any} = {};
    for (const row of result) {
      if (!row['REFERENCED_TABLE_NAME'])
        continue;
  
      foreignKeys[row['COLUMN_NAME']] = row;
    }
  
    return foreignKeys;
  }
  
  async getUniqueColumns(table: Table<any>) {
    const result = await this.knexDriver.getSpanner().withSchema('INFORMATION_SCHEMA').select().from('KEY_COLUMN_USAGE').where({
      'TABLE_SCHEMA': this.knexDriver.getDbName(),
      'TABLE_NAME': table.name
    });
    const uniqueColumns: string[] = [];
    for (const row of result) {
      if (!(row['CONSTRAINT_NAME'] as string).endsWith('_unique'))
        continue;
  
      uniqueColumns.push(row['COLUMN_NAME']);
    }
  
    return uniqueColumns;
  }
  
  async getIndexes(table: Table<any>) {
    const result = await this.knexDriver.getSpanner().raw(`SHOW INDEX FROM ${this.knexDriver.getDbName()}.${table.name}`);
    const indexes: { [keyName: string]: string[] } = {};
    for (const row of result[0]) {
      if (!indexes[row['Key_name']])
        indexes[row['Key_name']] = [];
  
      indexes[row['Key_name']].push(row['Column_name']);
    }
  
    return indexes;
  }
}