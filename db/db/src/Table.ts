import { Loadable, SourceRepository } from '@brentbahry/reflection';
import { CustomSerializableObject } from '@proteinjs/serializer';
import { Record } from './Record';
import { TableSerializerId } from './serializers/TableSerializer';

export const getTables = () => SourceRepository.get().objects<Table<any>>('@proteinjs/db/Table');

export const tableByName = (name: string) => {
	const tables = getTables();
	for (let table of tables) {
		if (table.name = name)
			return table;
	}

	throw new Error(`Unable to find table: ${name}`);
}

export abstract class Table<T extends Record> implements Loadable, CustomSerializableObject {
	public __serializerId = TableSerializerId;
	abstract name: string;
	abstract columns: Columns<T>;
	public primaryKey: (keyof T)[] = ['id'];
	public indexes: { columns: (keyof T)[], name?: string }[] = [];
}

type RequiredProps<T> = {
	[P in keyof T]: T[P] extends undefined ? never : P
}[keyof T]

type OptionalProps<T> = {
	[P in keyof T]: T[P] extends undefined ? P : never
}[keyof T]

export type Columns<T> = {
	[P in RequiredProps<T>]: Column<T[P], any>
} & {
	[P in OptionalProps<T>]?: Column<T[P] | undefined, any>
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
	options?: ColumnOptions,
	serialize?: (fieldValue: T|undefined, table: Table<any>, record: any, columnPropertyName: string) => Promise<Serialized|undefined>,
	deserialize?: (serializedField: Serialized, table: Table<any>, record: any, columnPropertyName: string) => Promise<T|void>
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