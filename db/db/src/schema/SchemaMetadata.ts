import { ParameterizationConfig, QueryBuilder } from '@proteinjs/db-query';
import { Table } from '../Table';
import { DbDriver } from '../Db';

export class SchemaMetadata {
  constructor(
    private dbDriver: DbDriver
  ){}

  async tableExists(table: Table<any>): Promise<boolean> {
		const qb = new QueryBuilder('INFORMATION_SCHEMA.TABLES').condition({ field: 'TABLE_NAME', operator: '=', value: table.name });
		const generateStatement = (config: ParameterizationConfig) => qb.toSql({ dbName: this.dbDriver.getDbName(), ...config });
		const results = await this.dbDriver.runQuery(generateStatement);
		return results.length > 0;
	}

  async columnExists(columnName: string, table: Table<any>): Promise<boolean> {
    const qb = QueryBuilder.fromObject({
      'TABLE_SCHEMA': this.dbDriver.getDbName(),
      'TABLE_NAME': table.name,
      'COLUMN_NAME': columnName,
    }, 'INFORMATION_SCHEMA.COLUMNS');
		const generateStatement = (config: ParameterizationConfig) => qb.toSql({ dbName: this.dbDriver.getDbName(), ...config });
		const results = await this.dbDriver.runQuery(generateStatement);
		return results.length > 0;
  }
  
  async getColumnMetadata(table: Table<any>) {
    const qb = QueryBuilder.fromObject({
      'TABLE_SCHEMA': this.dbDriver.getDbName(),
      'TABLE_NAME': table.name
    }, 'INFORMATION_SCHEMA.COLUMNS');
    const generateStatement = (config: ParameterizationConfig) => qb.toSql({ dbName: this.dbDriver.getDbName(), ...config });
		const results = await this.dbDriver.runQuery(generateStatement);
    const columnMetadata: {[columnName: string]: any} = {};
    for (const row of results)
      columnMetadata[row['COLUMN_NAME']] = row;
  
    return columnMetadata;
  }
  
  async getPrimaryKey(table: Table<any>) {
    const qb = QueryBuilder.fromObject({
      'TABLE_SCHEMA': this.dbDriver.getDbName(),
      'TABLE_NAME': table.name,
      'CONSTRAINT_NAME': 'PRIMARY',
    }, 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE');
    const generateStatement = (config: ParameterizationConfig) => qb.toSql({ dbName: this.dbDriver.getDbName(), ...config });
		const results = await this.dbDriver.runQuery(generateStatement);
    const primaryKey: string[] = [];
    for (const row of results)
      primaryKey.push(row['COLUMN_NAME']);
  
    return primaryKey;
  }
  
  async getForeignKeys(table: Table<any>) {
    const qb = QueryBuilder.fromObject({
      'TABLE_SCHEMA': this.dbDriver.getDbName(),
      'TABLE_NAME': table.name
    }, 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE');
    const generateStatement = (config: ParameterizationConfig) => qb.toSql({ dbName: this.dbDriver.getDbName(), ...config });
		const results = await this.dbDriver.runQuery(generateStatement);
    const foreignKeys: {[columnName: string]: any} = {};
    for (const row of results) {
      if (!row['REFERENCED_TABLE_NAME'])
        continue;
  
      foreignKeys[row['COLUMN_NAME']] = row;
    }
  
    return foreignKeys;
  }
  
  async getUniqueColumns(table: Table<any>) {
    const qb = QueryBuilder.fromObject({
      'TABLE_SCHEMA': this.dbDriver.getDbName(),
      'TABLE_NAME': table.name
    }, 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE');
    const generateStatement = (config: ParameterizationConfig) => qb.toSql({ dbName: this.dbDriver.getDbName(), ...config });
		const results = await this.dbDriver.runQuery(generateStatement);
    const uniqueColumns: string[] = [];
    for (const row of results) {
      if (!(row['CONSTRAINT_NAME'] as string).endsWith('_unique'))
        continue;
  
      uniqueColumns.push(row['COLUMN_NAME']);
    }
  
    return uniqueColumns;
  }
  
  async getIndexes(table: Table<any>) {
    const qb = new QueryBuilder(table.name).select({ indexes: true });
    const generateStatement = (config: ParameterizationConfig) => qb.toSql({ dbName: this.dbDriver.getDbName(), ...config });
		const results: any[] = await this.dbDriver.runQuery(generateStatement);
    const indexes: { [keyName: string]: string[] } = {};
    for (const row of results[0]) {
      if (!indexes[row['Key_name']])
        indexes[row['Key_name']] = [];
  
      indexes[row['Key_name']].push(row['Column_name']);
    }
  
    return indexes;
  }
}