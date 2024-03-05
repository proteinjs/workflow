import knex from 'knex';
import { BigIntegerColumn, BinaryColumn, BooleanColumn, Column, ColumnType, DateColumn, DateTimeColumn, DecimalColumn, FloatColumn, IntegerColumn, ObjectColumn, StringColumn, TextColumn, UuidColumn } from '@proteinjs/db';

export const getColumnFactory = (column: Column<any, any>) => {
  const columnFactory = columnFactories[column.type];
  if (!columnFactory)
    throw new Error(`Could not find ColumnFactory for column type: ${column.type}`);

  return columnFactory;
}

export type ColumnFactoryMap = { [key: string]: ColumnFactory }

export interface ColumnFactory {
  create(column: Column<any, any>, tableBuilder: knex.TableBuilder): knex.ColumnBuilder;
}

export class IntegerColumnFactory implements ColumnFactory {
	type: ColumnType = 'integer';

	create(integerColumn: IntegerColumn, tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		const columnBuilder = tableBuilder.integer(integerColumn.name, integerColumn.length);
		if (integerColumn.unsigned)
			columnBuilder.unsigned();

		return columnBuilder;
	}
}

export class BigIntegerColumnFactory implements ColumnFactory {
	type: ColumnType = 'bigInteger';

	create(bigIntegerColumn: BigIntegerColumn, tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		const columnBuilder = tableBuilder.bigInteger(bigIntegerColumn.name);
		if (bigIntegerColumn.unsigned)
			columnBuilder.unsigned();

		return columnBuilder;
	}
}

export class TextColumnFactory implements ColumnFactory {
	type: ColumnType = 'text';

	create(textColumn: TextColumn, tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.text(textColumn.name, textColumn.textType);
	}
}

export class StringColumnFactory implements ColumnFactory {
	type: ColumnType = 'string';
	
	create(stringColumn: StringColumn, tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.string(stringColumn.name, stringColumn.maxLength);
	}
}

export class FloatColumnFactory implements ColumnFactory {
	type: ColumnType = 'float';
	
	create(floatColumn: FloatColumn, tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.float(floatColumn.name, floatColumn.precision, floatColumn.scale);
	}
}

export class DecimalColumnFactory implements ColumnFactory {
	type: ColumnType = 'decimal';

	create(decimalColumn: DecimalColumn, tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.decimal(decimalColumn.name, decimalColumn.precision, decimalColumn.scale);
	}
}

export class BooleanColumnFactory implements ColumnFactory {
	type: ColumnType = 'boolean';

	create(booleanColumn: BooleanColumn, tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.boolean(booleanColumn.name);
	}
}

export class DateColumnFactory implements ColumnFactory {
	type: ColumnType = 'date';

	create(dateColumn: DateColumn, tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.date(dateColumn.name);
	}
}

export class DateTimeColumnFactory implements ColumnFactory {
	type: ColumnType = 'dateTime';

	create(dateTimeColumn: DateTimeColumn, tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.dateTime(dateTimeColumn.name);
	}
}

export class BinaryColumnFactory implements ColumnFactory {
	type: ColumnType = 'binary';

	create(binaryColumn: BinaryColumn, tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.binary(binaryColumn.name, binaryColumn.mysqlLength);
	}
}

export class ObjectColumnFactory implements ColumnFactory {
	type: ColumnType = 'mediumtext';

	create(objectColumn: ObjectColumn<any>, tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.text(objectColumn.name, objectColumn.type);
	}
}

export class UuidColumnFactory implements ColumnFactory {
	type: ColumnType = 'uuid';

	create(uuidColumn: UuidColumn, tableBuilder: knex.TableBuilder): knex.ColumnBuilder {
		return tableBuilder.uuid(uuidColumn.name);
	}
}

export const columnFactories: ColumnFactoryMap = {
  'integer': new IntegerColumnFactory(),
  'bigInteger': new BigIntegerColumnFactory(),
  'text': new TextColumnFactory(),
  'string': new StringColumnFactory(),
  'float': new FloatColumnFactory(),
  'decimal': new DecimalColumnFactory(),
  'boolean': new BooleanColumnFactory(),
  'date': new DateColumnFactory(),
  'dateTime': new DateTimeColumnFactory(),
  'binary': new BinaryColumnFactory(),
  'mediumtext': new ObjectColumnFactory(),
  'uuid': new UuidColumnFactory(),
}