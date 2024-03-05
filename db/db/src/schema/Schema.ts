import { Table } from '../Table';

export interface SchemaOperations {
  createTable(table: Table<any>): Promise<void>;
  alterTable(table: Table<any>, changes: TableChanges): Promise<void>;
}

export interface TableChanges {
  columnsToCreate: string[];
  columnsToRename: string[];
  columnsToAlter: string[];
  columnsWithForeignKeysToCreate: string[];
  columnsWithForeignKeysToDrop: string[];
  columnsWithUniqueConstraintsToCreate: string[];
  columnsWithUniqueConstraintsToDrop: string[];
  indexesToCreate: string[][];
  indexesToDrop: string[][];
  createPrimaryKey: boolean;
  dropExistingPrimaryKey: boolean;
  existingPrimaryKey: string[];
}

export interface SchemaMetadata {
  tableExists(table: Table<any>): Promise<boolean>;
  columnExists(columnName: string, table: Table<any>): Promise<boolean>;
  getColumnMetadata(table: Table<any>): Promise<any>;
  getPrimaryKey(table: Table<any>): Promise<string[]>;
  getForeignKeys(table: Table<any>): Promise<{[columnName: string]: any}>;
  getUniqueColumns(table: Table<any>): Promise<string[]>;
  getIndexes(table: Table<any>): Promise<{[keyName: string]: string[]}>;
}