import moment from 'moment';
import uuid from 'uuid';
import { Column, ColumnOptions, Table, ColumnType } from './Table';

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

	async serialize(fieldValue: moment.Moment, table: Table<any>, record: unknown, columnPropertyName: string): Promise<Date> {
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

export class ObjectColumn<T> implements Column<T, string> {
	type: ColumnType = 'mediumtext';
	
	constructor(
		public name: string,
		public options?: ColumnOptions,
		public largeObject: boolean = false // up to 4g, default up to 16m
	) {
		this.type = largeObject ? 'longtext' : 'mediumtext';
	}

	async serialize(fieldValue: T, table: Table<any>, record: unknown, columnPropertyName: string): Promise<string> {
		return JSON.stringify(fieldValue);
	}

	async deserialize(serializedField: string, table: Table<any>, record: unknown, columnPropertyName: string): Promise<T> {
		return JSON.parse(serializedField);
	}
}

export class UuidColumn implements Column<string, string> {
	type: ColumnType = 'uuid';
	
	constructor(
		public name: string,
		public options?: ColumnOptions
	) {
		this.options = Object.assign({ defaultTo: async () => uuid.v1().split('-').join('') }, options);
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

	async serialize(fieldValue: T[], table: Table<any>, record: unknown, columnPropertyName: string): Promise<string> {
		return await this.objectColumn.serialize(fieldValue, table, record, columnPropertyName);
	}

	async deserialize(serializedField: string, table: Table<any>, record: unknown, columnPropertyName: string): Promise<T[]> {
		return await this.objectColumn.deserialize(serializedField, table, record, columnPropertyName);
	}
}