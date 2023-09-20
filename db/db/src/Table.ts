import knex from 'knex';
import { Loadable, SourceRepository } from '@brentbahry/reflection';

export const getTables = () => SourceRepository.get().objects<Table<any>>('@proteinjs/db/Table');

export type Table<T> = Loadable & {
	name: string,
	columns: { [P in keyof T]: Column<T[P], T> },
	primaryKey?: (keyof T)[],
	indexes?: { columns: (keyof T)[], name?: string }[]
}

export type Column<T, Serialized> = {
	name: string,
	type: ColumnType,
	/**
	 * Use to rename column, will find column with `oldName` and change it to `name`.
	 * 
	 * Note: after name change has happened in prod, oldName can be removed.
	 */
	oldName?: string,
	/**
	 * Note: no need to apply Column.options, those will be added by the caller.
	 * 
	 * @return the knex.ColumnBuilder created for this column
	 */
	create: (tableBuilder: knex.TableBuilder) => knex.ColumnBuilder,
	options?: ColumnOptions,
	serialize?: (fieldValue: T, table: Table<any>, record: unknown, columnPropertyName: string) => Promise<Serialized>,
	deserialize?: (serializedField: Serialized, table: Table<any>, record: unknown, columnPropertyName: string) => Promise<T>
}

export type ColumnType = 'integer'
	| 'bigInteger'
	| 'text'
	| 'mediumtext'
	| 'longtext'
	| 'string'
	| 'float'
	| 'decimal'
	| 'boolean'
	| 'date'
	| 'dateTime'
	| 'binary'
	| 'uuid'
;

export const mysqlColumnTypeMap = {
	integer: 'int',
	bigInteger: 'bigint',
	text: 'text',
	mediumtext: 'mediumtext',
	longtext: 'longtext',
	string: 'varchar',
	float: 'float',
	decimal: 'decimal',
	boolean: 'tinyint',
	date: 'date',
	dateTime: 'datetime',
	binary: 'blob',
	uuid: 'char'
}

export type ColumnOptions = {
	unique?: { unique: boolean, indexName?: string },
	/**
	 * Note: use migration to drop or change existing foreign key
	 */
	references?: { table: string, column: string },
	nullable?: boolean,
	defaultValue?: () => any
}