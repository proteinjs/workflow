import { Logger } from '@brentbahry/util';
import { Table, mysqlColumnTypeMap, getTables } from '../Table';
import { SchemaMetadata, SchemaOperations, TableChanges } from './Schema';

export class TableManager {
	private logger = new Logger(this.constructor.name);

	constructor(
		public schemaMetadata: SchemaMetadata,
		public schemaOperations: SchemaOperations
	){}

	async tableExists(table: Table<any>) {
		return await this.schemaMetadata.tableExists(table);
	}

	async loadTables(): Promise<void> {
		const tables = getTables();
		for (const table of tables)
			await this.loadTable(table);
	}

	async loadTable(table: Table<any>): Promise<void> {
		if (await this.tableExists(table)) {
			const tableChanges = await this.getTableChanges(table);
			if (this.shouldAlterTable(tableChanges)) {
				this.logger.info(`Altering table: ${table.name}`);
				await this.schemaOperations.alterTable(table, tableChanges);
				this.logger.info(`Finished altering table: ${table.name}`);
			}
		} else {
			this.logger.info(`Creating table: ${table.name}`);
			await this.schemaOperations.createTable(table);
			this.logger.info(`Finished creating table: ${table.name}`);
		}
	}

	private shouldAlterTable(tableChanges: TableChanges) {
		if (
			tableChanges.columnsToCreate.length == 0 && 
			tableChanges.columnsToRename.length == 0 && 
			tableChanges.columnsToAlter.length == 0 &&
			tableChanges.columnsWithForeignKeysToDrop.length == 0 &&
			tableChanges.columnsWithUniqueConstraintsToDrop.length == 0 &&
			tableChanges.indexesToCreate.length == 0 &&
			tableChanges.indexesToDrop.length == 0 &&
			!tableChanges.dropExistingPrimaryKey && 
			!tableChanges.createPrimaryKey
		)
			return false;

		return true;
	}

	private async getTableChanges(table: Table<any>) {
		const { indexesToCreate, indexesToDrop } = await this.getIndexOperations(table);
		const existingPrimaryKey = await this.schemaMetadata.getPrimaryKey(table);
		const tableChanges: TableChanges = {
			columnsToCreate: [],
			columnsToRename: [],
			columnsToAlter: [],
			columnsWithForeignKeysToCreate: [],
			columnsWithForeignKeysToDrop: [],
			columnsWithUniqueConstraintsToCreate: [],
			columnsWithUniqueConstraintsToDrop: [],
			indexesToCreate,
			indexesToDrop,
			createPrimaryKey: false,
			dropExistingPrimaryKey: false,
			existingPrimaryKey,
		};

		if (existingPrimaryKey.length > 0 && !table.primaryKey)
			tableChanges.dropExistingPrimaryKey = true;
	
		// console.log(`(${table.name}) Primary key comparison, existing: ${JSON.stringify(existingPrimaryKey)}, current: ${JSON.stringify(table.primaryKey)}`)
		if (table.primaryKey && JSON.stringify(existingPrimaryKey) != JSON.stringify(table.primaryKey)) {
			tableChanges.dropExistingPrimaryKey = existingPrimaryKey.length > 0;
			tableChanges.createPrimaryKey = true;
			// console.log(`(${table.name}) Should create new primary key`)
		}

		const columnMetadata = await this.schemaMetadata.getColumnMetadata(table);
		const uniqueColumns = await this.schemaMetadata.getUniqueColumns(table);
		const foreignKeys = await this.schemaMetadata.getForeignKeys(table);
		for (const columnPropertyName in table.columns) {
			const column = table.columns[columnPropertyName];
			if (columnMetadata[column.name]) {
				let alter = false;
				const mysqlColumnType = mysqlColumnTypeMap[column.type];
				const existingMysqlColumnType = columnMetadata[column.name]['DATA_TYPE'];
				if (mysqlColumnType != existingMysqlColumnType) {
					// console.log(`mysqlColumnType != existingMysqlColumnType`);
					alter = true;
				}
				
				if (
					(column.options?.nullable && columnMetadata[column.name]['IS_NULLABLE'] == 'NO') ||
					(column.options?.nullable === false && columnMetadata[column.name]['IS_NULLABLE'] == 'YES')
				) {
					// console.log(`column.options?.nullable`)
					alter = true;
				}
				
				if (
					column.options?.unique?.unique === false && uniqueColumns.includes(column.name)
				) {
					// console.log(`column.options?.unique?.unique`)
					tableChanges.columnsWithUniqueConstraintsToDrop.push(column.name);
					alter = true;
				} else if (
					column.options?.unique?.unique && !uniqueColumns.includes(column.name)
				) {
					tableChanges.columnsWithUniqueConstraintsToCreate.push(column.name);
					alter = true;
				}
				
				if (
					!column.options?.references && foreignKeys[column.name] ||
					column.options?.references && foreignKeys[column.name] && (foreignKeys[column.name]['REFERENCED_TABLE_NAME'] != column.options.references.table || foreignKeys[column.name]['REFERENCED_COLUMN_NAME'] != column.options.references.column)
				) {
					// console.log(`column.options?.references`)
					tableChanges.columnsWithForeignKeysToDrop.push(column.name);
					alter = true;
				} else if (
					column.options?.references && !foreignKeys[column.name]
				) {
					tableChanges.columnsWithForeignKeysToCreate.push(column.name);
					alter = true;
				}
	
				if (alter)
					tableChanges.columnsToAlter.push(columnPropertyName);
	
				continue;
			}
	
			if (column.oldName && columnMetadata[column.oldName]) {
				tableChanges.columnsToRename.push(columnPropertyName);
				continue;
			}		
	
			tableChanges.columnsToCreate.push(columnPropertyName);
		}

		return tableChanges;
	}

	async getIndexOperations(table: Table<any>) {
    const existingIndexes = await this.schemaMetadata.getIndexes(table);
    const indexesToDrop: string[][] = [];
    const indexesToCreate: string[][] = [];
    const currentIndexMap: {[serializedColumns: string]: boolean} = {};
    const existingIndexMap: {[serializedColumns: string]: boolean} = {};
    for (const keyName in existingIndexes)
      existingIndexMap[JSON.stringify(existingIndexes[keyName])] = true;
  
    if (table.indexes) {
      for (const index of table.indexes) {
        const serializedColumns = JSON.stringify(index.columns);
        currentIndexMap[serializedColumns] = true;
        if (!existingIndexMap[serializedColumns])
          indexesToCreate.push(index.columns as string[]);
      }
    }
  
    for (const keyName in existingIndexes) {
      const existingIndex = existingIndexes[keyName];
      const serializedColumns = JSON.stringify(existingIndex);
      if (
				!currentIndexMap[serializedColumns] && 
				keyName != 'PRIMARY' &&
				!keyName.endsWith('_unique') &&
				!keyName.endsWith('_foreign')
			)
        indexesToDrop.push(existingIndex);
    }
  
    return { indexesToCreate, indexesToDrop };
  }
}