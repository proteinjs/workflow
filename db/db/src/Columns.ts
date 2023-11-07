import moment from 'moment';
import { v1 as uuidv1 } from 'uuid';
import { Column, ColumnOptions, Table, ColumnType, tableByName } from './Table';
import { Record } from './Record';
import { ReferenceArray } from './reference/ReferenceArray';
import { Db } from './Db';
import { Reference } from './reference/Reference';

export class IntegerColumn implements Column<number, number> {
	type: ColumnType = 'integer';

	constructor(
		public name: string,
		public options?: ColumnOptions,
		public length?: number,
		public unsigned: boolean = false
	) {}
}

export class BigIntegerColumn implements Column<number, number> {
	type: ColumnType = 'bigInteger';

	constructor(
		public name: string,
		public options?: ColumnOptions,
		public unsigned: boolean = false
	) {}
}

export class TextColumn implements Column<string, string> {
	type: ColumnType = 'text';
	
	constructor(
		public name: string,
		public options?: ColumnOptions,
		public textType: 'text'|'mediumtext'|'longtext' = 'text'
	) {
		this.type = textType;
	}
}

export class StringColumn implements Column<string, string> {
	type: ColumnType = 'string';
	
	constructor(
		public name: string,
		public options?: ColumnOptions,
		public maxLength: number = 255
	) {}
}

export class FloatColumn implements Column<number, number> {
	type: ColumnType = 'float';
	
	constructor(
		public name: string,
		public options?: ColumnOptions,
		public precision: number = 8,
		public scale: number = 2
	) {}
}

export class DecimalColumn implements Column<number, number> {
	type: ColumnType = 'decimal';
	
	constructor(
		public name: string,
		public options?: ColumnOptions,
		public precision: number = 8,
		public scale: number = 2
	) {}
}

export class BooleanColumn implements Column<boolean, boolean> {
	type: ColumnType = 'boolean';
	
	constructor(
		public name: string,
		public options?: ColumnOptions
	) {}

	async serialize(fieldValue: boolean|undefined, table: Table<any>, record: unknown, columnPropertyName: string): Promise<boolean> {
		if (fieldValue)
			return true;

		return false;
	}

	async deserialize(serializedField: boolean, table: Table<any>, record: unknown, columnPropertyName: string): Promise<boolean> {
		if (serializedField)
			return true;

		return false;
	}
}

export class DateColumn implements Column<Date, Date> {
	type: ColumnType = 'date';
	
	constructor(
		public name: string,
		public options?: ColumnOptions
	) {}
}

export class DateTimeColumn implements Column<moment.Moment, Date> {
	type: ColumnType = 'dateTime';
	
	constructor(
		public name: string,
		public options?: ColumnOptions
	) {}

	async serialize(fieldValue: moment.Moment|undefined, table: Table<any>, record: unknown, columnPropertyName: string): Promise<Date|undefined> {
		if (typeof fieldValue === 'undefined')
			return;

		if (typeof fieldValue.toDate === 'undefined')
			return moment(fieldValue).toDate();

		return fieldValue.toDate();
	}

	async deserialize(serializedField: Date, table: Table<any>, record: unknown, columnPropertyName: string): Promise<moment.Moment> {
		return moment(serializedField);
	}
}

export class BinaryColumn implements Column<number, number> {
	type: ColumnType = 'binary';
	
	constructor(
		public name: string,
		public options?: ColumnOptions,
		public mysqlLength?: number,
	) {}
}

export class UuidColumn implements Column<string, string> {
	type: ColumnType = 'uuid';
	
	constructor(
		public name: string,
		public options?: ColumnOptions
	) {
		this.options = Object.assign({ defaultValue: async () => uuidv1().split('-').join('') }, options);
	}
}

export class ObjectColumn<T> implements Column<T, string> {
	type: ColumnType = 'mediumtext';
	
	constructor(
		public name: string,
		public options?: ColumnOptions,
		public largeObject: boolean = false // up to 4g, default up to 16m
	) {
		this.type = largeObject ? 'longtext' : 'mediumtext';
	}

	async serialize(fieldValue: T|undefined, table: Table<any>, record: unknown, columnPropertyName: string): Promise<string|undefined> {
		if (typeof fieldValue === 'undefined' || fieldValue == null)
			return;
		
		return JSON.stringify(fieldValue);
	}

	async deserialize(serializedField: string, table: Table<any>, record: unknown, columnPropertyName: string): Promise<T|undefined> {
		if (typeof serializedField === 'undefined' || serializedField == null)
			return;
		
		return JSON.parse(serializedField);
	}
}

export class ArrayColumn<T> implements Column<T[], string> {
	private objectColumn: ObjectColumn<T[]>;
	
	constructor(
		public name: string,
		public options?: ColumnOptions,
		public largeObject: boolean = false // up to 4g, default up to 16m
	) {
		this.objectColumn = new ObjectColumn(name, options, largeObject);
	}

	get type() {
		return this.objectColumn.type;
	}

	async serialize(fieldValue: T[]|undefined, table: Table<any>, record: unknown, columnPropertyName: string): Promise<string|undefined> {
		return await this.objectColumn.serialize(fieldValue, table, record, columnPropertyName);
	}

	async deserialize(serializedField: string, table: Table<any>, record: unknown, columnPropertyName: string): Promise<T[]|undefined> {
		return await this.objectColumn.deserialize(serializedField, table, record, columnPropertyName);
	}
}

export class ReferenceArrayColumn<T extends Record> implements Column<ReferenceArray<T>, string> {
	private arrayColumn: ArrayColumn<string>;
	
	/**
	 * A column that stores an array of references to other records.
	 * 
	 * @param name name of column
	 * @param referenceTable name of table that the reference records are in
	 * @param cascadeDelete if true referenced records will be deleted when this record is deleted
	 * @param options generic column options
	 * @param largeObject if true store up to 4g, default (false) up to 16m; only record ids are stored
	 */
	constructor(
		public name: string,
		public referenceTable: string,
		public cascadeDelete: boolean,
		public options?: ColumnOptions,
		public largeObject: boolean = false
	) {
		this.arrayColumn = new ArrayColumn(name, options, largeObject);
	}

	get type() {
		return this.arrayColumn.type;
	}

	async serialize(fieldValue: ReferenceArray<T>|undefined, table: Table<any>, record: any, columnPropertyName: string): Promise<string|undefined> {
		if (typeof fieldValue === 'undefined')
			return;
		
		const ids = (await fieldValue.get()).map(record => record.id);
		return await this.arrayColumn.serialize(ids, table, record, columnPropertyName);
	}

	async deserialize(serializedFieldValue: string, table: Table<any>, record: any, columnPropertyName: string): Promise<ReferenceArray<T>> {
		let ids = await this.arrayColumn.deserialize(serializedFieldValue, table, record, columnPropertyName);
		if (typeof ids === 'undefined')
			ids = [];

		return new ReferenceArray(this.referenceTable, ids);
	}

	async beforeDelete(table: Table<any>, columnPropertyName: string, records: any[]) {
		if (!this.cascadeDelete)
			return;

		const recordIdsToDelete: string[] = [];
		for (let record of records) {
			const referenceArray = record[columnPropertyName] as ReferenceArray<Record>;
			const referenceRecords = await referenceArray.get();
			for (let referenceRecord of referenceRecords)
				recordIdsToDelete.push(referenceRecord.id);
		}

		if (recordIdsToDelete.length < 1)
			return;

		const referenceTable = tableByName(this.referenceTable);
		await new Db().delete(referenceTable, [{ column: 'id', operator: 'in', value: recordIdsToDelete }]);
	}
}

export class ReferenceColumn<T extends Record> implements Column<Reference<T>, string> {
	private stringColumn: StringColumn;
	
	/**
	 * A column that stores a reference (id) to another record.
	 * 
	 * @param name name of column
	 * @param referenceTable name of table that the reference record is in
	 * @param cascadeDelete if true referenced record will be deleted when this record is deleted
	 * @param options generic column options
	 */
	constructor(
		public name: string,
		public referenceTable: string,
		public cascadeDelete: boolean,
		public options?: ColumnOptions
	) {
		this.stringColumn = new StringColumn(name, options);
	}

	get type() {
		return this.stringColumn.type;
	}

	async serialize(fieldValue: Reference<T>|undefined, table: Table<any>, record: any, columnPropertyName: string): Promise<string|undefined> {
		if (typeof fieldValue === 'undefined')
			return;
		
		const reference = await fieldValue.get();
		if (!reference)
			return;

		return reference.id;
	}

	async deserialize(serializedFieldValue: string, table: Table<any>, record: any, columnPropertyName: string): Promise<Reference<T>> {
		return new Reference(this.referenceTable, serializedFieldValue);
	}

	async beforeDelete(table: Table<any>, columnPropertyName: string, records: any[]) {
		if (!this.cascadeDelete)
			return;

		const recordIdsToDelete: string[] = [];
		for (let record of records) {
			const reference = record[columnPropertyName] as Reference<Record>;
			const referenceRecord = await reference.get();
			if (referenceRecord)
				recordIdsToDelete.push(referenceRecord.id);
		}

		if (recordIdsToDelete.length < 1)
			return;

		const referenceTable = tableByName(this.referenceTable);
		await new Db().delete(referenceTable, [{ column: 'id', operator: 'in', value: recordIdsToDelete }]);
	}
}