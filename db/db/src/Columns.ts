import knex from 'knex';
import moment from 'moment';
import uuid from 'uuid';
import { Column, ColumnOptions, Table, ColumnType } from './Table';

export class IntegerColumn implements Column<number, number> {
	type: ColumnType = 'integer';

	constructor(
		public name: string,
		public options?: ColumnOptions,
		private length?: number,
		private unsigned: boolean = false
	) {}

	create(tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		const columnBuilder = tableBuilder.integer(this.name, this.length);
		if (this.unsigned)
			columnBuilder.unsigned();

		return columnBuilder;
	}
}

export class BigIntegerColumn implements Column<number, number> {
	type: ColumnType = 'bigInteger';

	constructor(
		public name: string,
		public options?: ColumnOptions,
		private unsigned: boolean = false
	) {}

	create(tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		const columnBuilder = tableBuilder.bigInteger(this.name);
		if (this.unsigned)
			columnBuilder.unsigned();

		return columnBuilder;
	}
}

export class TextColumn implements Column<string, string> {
	type: ColumnType = 'text';
	
	constructor(
		public name: string,
		public options?: ColumnOptions,
		private textType: 'text'|'mediumtext'|'longtext' = 'text'
	) {
		this.type = textType;
	}

	create(tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.text(this.name, this.textType);
	}
}

export class StringColumn implements Column<string, string> {
	type: ColumnType = 'string';
	
	constructor(
		public name: string,
		public options?: ColumnOptions,
		private maxLength: number = 255
	) {}

	create(tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.string(this.name, this.maxLength);
	}
}

export class FloatColumn implements Column<number, number> {
	type: ColumnType = 'float';
	
	constructor(
		public name: string,
		public options?: ColumnOptions,
		private precision: number = 8,
		private scale: number = 2
	) {}

	create(tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.float(this.name, this.precision, this.scale);
	}
}

export class DecimalColumn implements Column<number, number> {
	type: ColumnType = 'decimal';
	
	constructor(
		public name: string,
		public options?: ColumnOptions,
		public precision: number = 8,
		public scale: number = 2
	) {}

	create(tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.decimal(this.name, this.precision, this.scale);
	}
}

export class BooleanColumn implements Column<boolean, boolean> {
	type: ColumnType = 'boolean';
	
	constructor(
		public name: string,
		public options?: ColumnOptions
	) {}

	create(tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.boolean(this.name);
	}
}

export class DateColumn implements Column<Date, Date> {
	type: ColumnType = 'date';
	
	constructor(
		public name: string,
		public options?: ColumnOptions
	) {}

	create(tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.date(this.name);
	}
}

export class DateTimeColumn implements Column<moment.Moment, Date> {
	type: ColumnType = 'dateTime';
	
	constructor(
		public name: string,
		public options?: ColumnOptions
	) {}

	create(tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.dateTime(this.name);
	}

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

	create(tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.binary(this.name, this.mysqlLength);
	}
}

export class ObjectColumn<T> implements Column<T, string> {
	type: ColumnType = 'mediumtext';
	
	constructor(
		public name: string,
		public options?: ColumnOptions,
		public largeObject: boolean = false // up to 4g, default up to 16m
	) {}

	create(tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		this.type = this.largeObject ? 'longtext' : 'mediumtext';
		return tableBuilder.text(this.name, this.type);
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

	create(tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.uuid(this.name);
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

	create(tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return this.objectColumn.create(tableBuilder);
	}

	async serialize(fieldValue: T[], table: Table<any>, record: unknown, columnPropertyName: string): Promise<string> {
		return await this.objectColumn.serialize(fieldValue, table, record, columnPropertyName);
	}

	async deserialize(serializedField: string, table: Table<any>, record: unknown, columnPropertyName: string): Promise<T[]> {
		return await this.objectColumn.deserialize(serializedField, table, record, columnPropertyName);
	}
}