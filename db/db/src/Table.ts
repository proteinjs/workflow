import { Loadable, SourceRepository } from '@brentbahry/reflection';
import { CustomSerializableObject } from '@proteinjs/serializer';
import { Record } from './Record';
import { TableSerializerId } from './serializers/TableSerializer';

export const getTables = () => SourceRepository.get().objects<Table<any>>('@proteinjs/db/Table');

export const tableByName = (name: string) => {
	const tables = getTables();
	for (let table of tables) {
		if (table.name == name)
			return table;
	}

	throw new Error(`Unable to find table: ${name}`);
}

export const getColumnPropertyName = (table: Table<any>, columnName: string) => {
	for (let columnPropertyName in table.columns) {
		const column = table.columns[columnPropertyName];
		if (column.name == columnName)
			return columnPropertyName;
	}

	return null;
}

export const getColumnByName = (table: Table<any>, columnName: string) => {
	for (let columnPropertyName in table.columns) {
		const column = table.columns[columnPropertyName];
		if (column.name == columnName)
			return column;
	}

	return null;
}

/**
 * primary key is `id`
 */
export abstract class Table<T extends Record> implements Loadable, CustomSerializableObject {
	public __serializerId = TableSerializerId;
	abstract name: string;
	abstract columns: Columns<T>;
	public indexes: { columns: (keyof T)[], name?: string }[] = [];
	public cascadeDeleteReferences: () => { table: string, referenceColumn: string }[] = () => [];
	public loadRecordsFromSource = false;
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
	/**
	 * Use to rename column, will find column with `oldName` and change it to `name`.
	 * 
	 * Note: after name change has happened in prod, oldName can be removed.
	 */
	oldName?: string,
	options?: ColumnOptions,
	serialize?: (fieldValue: T|undefined) => Promise<Serialized|undefined>,
	deserialize?: (serializedFieldValue: Serialized) => Promise<T|void>,
	beforeDelete?: (table: Table<any>, columnPropertyName: string, records: any[]) => Promise<void>,
}

export type ColumnOptions = {
	unique?: { unique: boolean, indexName?: string },
	/**
	 * The column in the reference table `table` is the primary key of the table (`id` unless otherwise specified in the Table definition)
	 * 
	 * Note: use a migration to drop or change an existing foreign key
	 */
	references?: { table: string },
	nullable?: boolean,
	defaultValue?: () => Promise<any>,
	updateValue?: () => Promise<any>,
}