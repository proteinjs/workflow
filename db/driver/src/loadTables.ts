import * as knex from 'knex';
import { Table, Column, mysqlColumnTypeMap, getTables } from '@proteinjs/db';
import { MysqlDriver } from './MysqlDriver';
import { getColumnFactory } from './getColumnFactory';
import { Logger } from '@brentbahry/util';

export async function loadTables(): Promise<void> {
	const tables = getTables();
	for (const table of tables)
		await loadTable(table);
}

export async function loadTable(table: Table<any>): Promise<void> {
	if (await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(table.name))
		await alterTable(table);
	else
		await createTable(table);
}

async function createTable(table: Table<any>) {
	let resolve: any;
	let reject: any;
	const p = new Promise<void>((rs, rj) => {
		resolve = rs;
		reject = rj;
	});

	const logger = new Logger('createTable');
	logger.info(`Creating table: ${table.name}`);
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).createTable(table.name, (tableBuilder: any) => {
		for (const columnPropertyName in table.columns) {
			const column = table.columns[columnPropertyName];
			createColumn(column, tableBuilder as any, table);
			logger.info(`[${table.name}] Created column: ${column.name}`);
		}

		if (table.primaryKey) {
			tableBuilder.primary(table.primaryKey as string[]);
			logger.info(`[${table.name}] Created primary key: ${table.primaryKey}`);
		}

		if (table.indexes) {
			for (const index of table.indexes) {
				const columnNames = index.columns.map((columnPropertyName) => table.columns[columnPropertyName as string].name)
				tableBuilder.index(columnNames, index.name);
				logger.info(`[${table.name}] Created index: ${columnNames}`);
			}
		}

		logger.info(`Finished creating table: ${table.name}`);
		resolve();
	}).catch((reason: any) => {
		reject(`Failed to create table: ${table.name}. reason: ${reason}`);
	});

	return p;
}

async function alterTable(table: Table<any>) {
	let resolve: any;
	let reject: any;
	const p = new Promise<void>((rs, rj) => {
		resolve = rs;
		reject = rj;
	});

	const logger = new Logger('alterTable');
	const columnsToCreate: string[] = [];
	const columnsToRename: string[] = [];
	const columnsToAlter: string[] = [];
	const columnsWithForeignKeysToDrop: string[] = [];
	const columnsWithUniqeConstraintToDrop: string[] = [];
	const columnMetadata = await getColumnMetadata(table);
	const uniqueColumns = await getUniqueColumns(table);
	const foreignKeys = await getForeignKeys(table);
	const { indexesToCreate, indexesToDrop } = await getIndexOperations(table);
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
				column.options?.unique?.unique && !uniqueColumns.includes(column.name) ||
				column.options?.unique?.unique === false && uniqueColumns.includes(column.name)
			) {
				// console.log(`column.options?.unique?.unique`)
				columnsWithUniqeConstraintToDrop.push(column.name);
				alter = true;
			} 
			
			if (
				column.options?.references && !foreignKeys[column.name] ||
				!column.options?.references && foreignKeys[column.name] ||
				column.options?.references && foreignKeys[column.name] && (foreignKeys[column.name]['REFERENCED_TABLE_NAME'] != column.options.references.table || foreignKeys[column.name]['REFERENCED_COLUMN_NAME'] != column.options.references.column)
			) {
				// console.log(`column.options?.references`)
				columnsWithForeignKeysToDrop.push(column.name);
				alter = true;
			}

			if (alter)
				columnsToAlter.push(columnPropertyName);

			continue;
		}

		if (column.oldName && columnMetadata[column.oldName]) {
			columnsToRename.push(columnPropertyName);
			continue;
		}		

		columnsToCreate.push(columnPropertyName);
	}

	const existingPrimaryKey = await getPrimaryKey(table);
	let dropExistingPrimaryKey = false;
	if (existingPrimaryKey.length > 0 && !table.primaryKey)
		dropExistingPrimaryKey = true;

	let createPrimaryKey = false;
	// console.log(`Primary key comparison, existing: ${JSON.stringify(existingPrimaryKey)}, current: ${JSON.stringify(table.primaryKey)}`)
	if (table.primaryKey && JSON.stringify(existingPrimaryKey) != JSON.stringify(table.primaryKey)) {
		dropExistingPrimaryKey = true;
		createPrimaryKey = true;
	}

	// console.log(`columnsToCreate.length == 0: ${columnsToCreate.length == 0}`);
	// console.log(`columnsToRename.length == 0: ${columnsToRename.length == 0}`);
	// console.log(`columnsToAlter.length == 0: ${columnsToAlter.length == 0}`);
	// console.log(`columnsWithForeignKeysToDrop.length == 0: ${columnsWithForeignKeysToDrop.length == 0}`);
	// console.log(`columnsWithUniqeConstraintToDrop.length == 0: ${columnsWithUniqeConstraintToDrop.length == 0}`);
	// console.log(`indexesToCreate.length == 0: ${indexesToCreate.length == 0}`);
	// console.log(`indexesToDrop.length == 0: ${indexesToDrop.length == 0}`);
	// console.log(`!dropExistingPrimaryKey: ${!dropExistingPrimaryKey}`);
	// console.log(`!createPrimaryKey: ${!createPrimaryKey}`);

	if (
		columnsToCreate.length == 0 && 
		columnsToRename.length == 0 && 
		columnsToAlter.length == 0 &&
		columnsWithForeignKeysToDrop.length == 0 &&
		columnsWithUniqeConstraintToDrop.length == 0 &&
		indexesToCreate.length == 0 &&
		indexesToDrop.length == 0 &&
		!dropExistingPrimaryKey && 
		!createPrimaryKey
	)
		return;
		
	logger.info(`Altering table: ${table.name}`);
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).table(table.name, (tableBuilder: knex.TableBuilder) => {
		for (const columnPropertyName of columnsToCreate) {
			const column = table.columns[columnPropertyName];
			createColumn(column, tableBuilder as any, table);
			logger.info(`[${table.name}] Created column: ${column.name}`);
		}

		for (const column of columnsWithUniqeConstraintToDrop) {
			tableBuilder.dropUnique([column]);
			logger.info(`[${table.name}.${column}] Dropped unique constraint`);
		}

		for (const column of columnsWithForeignKeysToDrop) {
			tableBuilder.dropForeign([column]);
			logger.info(`[${table.name}.${column}] Dropped foreign key`);
		}

		for (const index of indexesToDrop) {
			tableBuilder.dropIndex(index);
			logger.info(`[${table.name}] Dropped index: ${index}`);
		}

		for (const columnPropertyName of columnsToAlter) {
			const column = table.columns[columnPropertyName];
			createColumn(column, tableBuilder as any, table).alter();
			logger.info(`[${table.name}.${column.name}] Altered column, type: ${column.type}`);
		}

		for (const columnPropertyName of columnsToRename) {
			const column = table.columns[columnPropertyName];
			if (!column.oldName)
				continue;

			tableBuilder.renameColumn(column.oldName, column.name);
			logger.info(`[${table.name}] Renamed column: ${column.oldName} -> ${column.name}`);
		}

		if (dropExistingPrimaryKey) {
			tableBuilder.dropPrimary();
			logger.info(`[${table.name}] Dropped primary key: ${existingPrimaryKey}`);
		}

		if (createPrimaryKey) {
			tableBuilder.primary(table.primaryKey as string[]);
			logger.info(`[${table.name}] Created primary key: ${table.primaryKey}`);
		}

		for (const index of indexesToCreate) {
			tableBuilder.index(index);
			logger.info(`[${table.name}] Created index: ${index}`);
		}

		logger.info(`Finished altering table: ${table.name}`);
		resolve();
		return;
	}).catch((reason: any) => {
		reject(`Failed to alter table: ${table.name}. reason: ${reason}`);
		return;
	});

	return p;
}

async function getIndexOperations(table: Table<any>) {
	const existingIndexes = await getIndexes(table);
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
		if (!currentIndexMap[serializedColumns] && keyName != 'PRIMARY')
			indexesToDrop.push(existingIndex);
	}

	return { indexesToCreate, indexesToDrop };
}

export async function columnExists(tableName: string, columnName: string): Promise<boolean> {
	const result = await MysqlDriver.getKnex().withSchema('INFORMATION_SCHEMA').select().from('COLUMNS').where({
		'TABLE_SCHEMA': MysqlDriver.getDbName(),
		'TABLE_NAME': tableName,
		'COLUMN_NAME': columnName
	});
	return result.length > 0;
}

function createColumn(column: Column<any, any>, tableBuilder: knex.TableBuilder, table: Table<any>) {
	const logger = new Logger('createColumn');
	const columnFactory = getColumnFactory(column);
	const columnBuilder = columnFactory.create(column, tableBuilder);
	if (column.options?.unique?.unique) {
		columnBuilder.unique(column.options.unique.indexName);
		logger.info(`[${table.name}.${column.name}] Added unique constraint`);
	}

	if (column.options?.references) {
		columnBuilder.references(column.options.references.column).inTable(`${MysqlDriver.getDbName()}.${column.options.references.table}`);
		logger.info(`[${table.name}.${column.name}] Added foreign key -> ${column.options.references.table}.${column.options.references.column}`);
	}

	if (typeof column.options?.nullable !== 'undefined') {
		if (column.options?.nullable)
			columnBuilder.nullable();
		else
			columnBuilder.notNullable();

		logger.info(`[${table.name}.${column.name}] Added constraint nullable: ${column.options?.nullable}`);
	}

	return columnBuilder;
}

export async function getColumnMetadata(table: Table<any>) {
	const result = await MysqlDriver.getKnex().withSchema('INFORMATION_SCHEMA').select().from('COLUMNS').where({
		'TABLE_SCHEMA': MysqlDriver.getDbName(),
		'TABLE_NAME': table.name
	});
	const columnMetadata: {[columnName: string]: any} = {};
	for (const row of result)
		columnMetadata[row['COLUMN_NAME']] = row;

	return columnMetadata;
}

export async function getPrimaryKey(table: Table<any>) {
	const result = await MysqlDriver.getKnex().withSchema('INFORMATION_SCHEMA').select().from('KEY_COLUMN_USAGE').where({
		'TABLE_SCHEMA': MysqlDriver.getDbName(),
		'TABLE_NAME': table.name,
		'CONSTRAINT_NAME': 'PRIMARY'
	});
	const primaryKey: string[] = [];
	for (const row of result)
		primaryKey.push(row['COLUMN_NAME']);

	return primaryKey;
}

export async function getForeignKeys(table: Table<any>) {
	const result = await MysqlDriver.getKnex().withSchema('INFORMATION_SCHEMA').select().from('KEY_COLUMN_USAGE').where({
		'TABLE_SCHEMA': MysqlDriver.getDbName(),
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

export async function getUniqueColumns(table: Table<any>) {
	const result = await MysqlDriver.getKnex().withSchema('INFORMATION_SCHEMA').select().from('KEY_COLUMN_USAGE').where({
		'TABLE_SCHEMA': MysqlDriver.getDbName(),
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

export async function getIndexes(table: Table<any>) {
	const result = await MysqlDriver.getKnex().raw(`SHOW INDEX FROM ${MysqlDriver.getDbName()}.${table.name}`);
	const indexes: { [keyName: string]: string[] } = {};
	for (const row of result[0]) {
		if (!indexes[row['Key_name']])
			indexes[row['Key_name']] = [];

		indexes[row['Key_name']].push(row['Column_name']);
	}

	return indexes;
}