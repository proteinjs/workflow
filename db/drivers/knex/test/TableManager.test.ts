import '../generated/index';
import { Table, StringColumn, BooleanColumn, ObjectColumn, IntegerColumn, BigIntegerColumn, TextColumn, FloatColumn, DecimalColumn, DateColumn, DateTimeColumn, BinaryColumn, UuidColumn, Record, withRecordColumns, Db } from '@proteinjs/db';
import { KnexDriver } from '../src/KnexDriver';

interface User extends Record {
	name: string,
	email: string,
	active: boolean,
};

class UserTable extends Table<User> {
	name = 'db_test_user';
	columns = withRecordColumns<User>({
		name: new StringColumn('name'),
    email: new StringColumn('email'),
		active: new BooleanColumn('active'),
	});
	primaryKey = ['id'] as (keyof User)[];
	indexes = [
		{ columns: ['email'] as (keyof User)[] },
		{ columns: ['active', 'email'] as (keyof User)[] },
	]
};

interface ColumnTypes extends Record {
	integer: number;
	bigInteger: number;
	text: string;
	string: string;
	float: number;
	decimal: number;
	boolean: boolean;
	date: Date;
	dateTime: moment.Moment;
	binary: boolean;
	object: any;
	uuid: string;
}

class ColumnTypesTable extends Table<ColumnTypes> {
	name = 'db_test_column_types';
	columns = withRecordColumns<ColumnTypes>({
		integer: new IntegerColumn('integer', { nullable: true }),
		bigInteger: new BigIntegerColumn('big_integer', { nullable: false }),
		text: new TextColumn('text'),
		string: new StringColumn('string', { references: { table: 'db_test_user', column: 'id' } }),
		float: new FloatColumn('float', { defaultValue: async () => 0.5 }),
		decimal: new DecimalColumn('decimal'),
		boolean: new BooleanColumn('boolean'),
		date: new DateColumn('date'),
		dateTime: new DateTimeColumn('date_time'),
		binary: new BinaryColumn('binary'),
		object: new ObjectColumn('object'),
		uuid: new UuidColumn('uuid', { unique: { unique: true } })
	});
	primaryKey = ['uuid'] as (keyof ColumnTypes)[];
}

const knexDriver = new KnexDriver({
	host: 'localhost',
	user: 'root',
	password: '',
	dbName: 'test',
});
const tableManager = knexDriver.getTableManager();
const db = new Db(knexDriver, (tableName: string) => {
	const userTable = new UserTable();
	if (userTable.name == tableName)
		return userTable;

	const columnTypesTable = new ColumnTypesTable();
	if (columnTypesTable.name == tableName)
		return columnTypesTable;

	throw new Error(`Unsupported table in test environment: ${tableName}`);
});

beforeAll(async () => {
	await new KnexDriver().init();
})

afterEach(async () => {
	const columnTypesTable = new ColumnTypesTable();
	if (await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(columnTypesTable.name))
		await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).dropTable(columnTypesTable.name);

	const userTable = new UserTable();
	if (await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(userTable.name))
		await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).dropTable(userTable.name);
})

afterAll(async () => {
	await new KnexDriver().getKnex().destroy();
});

test('create primary key', async () => {
	const userTable = new UserTable();
	await tableManager.loadTable(userTable);
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(userTable.name)).toBeTruthy();
	const primaryKey = await tableManager.schemaMetadata.getPrimaryKey(userTable);
	expect(primaryKey[0]).toBe('id');
	expect(primaryKey.length).toBe(1);
});

test('alter primary key', async () => {
	const userTable = new UserTable();
	await tableManager.loadTable(userTable);
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(userTable.name)).toBeTruthy();
	let primaryKey = await tableManager.schemaMetadata.getPrimaryKey(userTable);
	expect(primaryKey[0]).toBe('id');
	expect(primaryKey.length).toBe(1);
	userTable.primaryKey = ['name', 'email'];
	await tableManager.loadTable(userTable);
	primaryKey = await tableManager.schemaMetadata.getPrimaryKey(userTable);
	expect(primaryKey[0]).toBe('name');
	expect(primaryKey[1]).toBe('email');
	expect(primaryKey.length).toBe(2);
});

test('create columns', async () => {
	const userTable = new UserTable();
	await tableManager.loadTable(userTable);
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(userTable.name)).toBeTruthy();
	expect(await tableManager.schemaMetadata.columnExists(userTable.columns.name.name, userTable)).toBeTruthy();
	expect(await tableManager.schemaMetadata.columnExists(userTable.columns.email.name, userTable)).toBeTruthy();
	expect(await tableManager.schemaMetadata.columnExists(userTable.columns.active.name, userTable)).toBeTruthy();
});

test('add column via alter', async () => {
	const userTable = new UserTable();
	const dataColumn = new ObjectColumn('data');
	await tableManager.loadTable(userTable);
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(userTable.name)).toBeTruthy();
	expect(await tableManager.schemaMetadata.columnExists(userTable.columns.name.name, userTable)).toBeTruthy();
	expect(await tableManager.schemaMetadata.columnExists(userTable.columns.email.name, userTable)).toBeTruthy();
	expect(await tableManager.schemaMetadata.columnExists(userTable.columns.active.name, userTable)).toBeTruthy();
	expect(await tableManager.schemaMetadata.columnExists(dataColumn.name, userTable)).toBeFalsy();
	(userTable as Table<any>).columns['data'] = dataColumn;
	await tableManager.loadTable(userTable);
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(userTable.name)).toBeTruthy();
	expect(await tableManager.schemaMetadata.columnExists(userTable.columns.name.name, userTable)).toBeTruthy();
	expect(await tableManager.schemaMetadata.columnExists(userTable.columns.email.name, userTable)).toBeTruthy();
	expect(await tableManager.schemaMetadata.columnExists(userTable.columns.active.name, userTable)).toBeTruthy();
	expect(await tableManager.schemaMetadata.columnExists(dataColumn.name, userTable)).toBeTruthy();
});

test('columns created with correct types', async () => {
	const userTable = new UserTable();
	const columnTypesTable = new ColumnTypesTable();
	await tableManager.loadTable(userTable);
	await tableManager.loadTable(columnTypesTable);
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(columnTypesTable.name)).toBeTruthy();
	const columnMetadata = await tableManager.schemaMetadata.getColumnMetadata(columnTypesTable);
	expect(columnMetadata[columnTypesTable.columns.integer.name]['DATA_TYPE']).toBe('int');
	expect(columnMetadata[columnTypesTable.columns.bigInteger.name]['DATA_TYPE']).toBe('bigint');
	expect(columnMetadata[columnTypesTable.columns.text.name]['DATA_TYPE']).toBe('text');
	expect(columnMetadata[columnTypesTable.columns.string.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[columnTypesTable.columns.float.name]['DATA_TYPE']).toBe('float');
	expect(columnMetadata[columnTypesTable.columns.decimal.name]['DATA_TYPE']).toBe('decimal');
	expect(columnMetadata[columnTypesTable.columns.boolean.name]['DATA_TYPE']).toBe('tinyint');
	expect(columnMetadata[columnTypesTable.columns.date.name]['DATA_TYPE']).toBe('date');
	expect(columnMetadata[columnTypesTable.columns.dateTime.name]['DATA_TYPE']).toBe('datetime');
	expect(columnMetadata[columnTypesTable.columns.binary.name]['DATA_TYPE']).toBe('blob');
	expect(columnMetadata[columnTypesTable.columns.object.name]['DATA_TYPE']).toBe('mediumtext');
	expect(columnMetadata[columnTypesTable.columns.uuid.name]['DATA_TYPE']).toBe('char');
});

test('columns created with correct options', async () => {
	const userTable = new UserTable();
	const columnTypesTable = new ColumnTypesTable();
	await tableManager.loadTable(userTable);
	await tableManager.loadTable(columnTypesTable);
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(userTable.name)).toBeTruthy();
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(columnTypesTable.name)).toBeTruthy();
	
	const columnMetadata = await tableManager.schemaMetadata.getColumnMetadata(columnTypesTable);
	expect(columnMetadata[columnTypesTable.columns.integer.name]['IS_NULLABLE']).toBe('YES');
	expect(columnMetadata[columnTypesTable.columns.bigInteger.name]['IS_NULLABLE']).toBe('NO');
	// expect(parseFloat(columnMetadata[TestColumnTypesTable.columns.float.name]['COLUMN_DEFAULT'])).toBe(0.5);
	
	const foreignKeys = await tableManager.schemaMetadata.getForeignKeys(columnTypesTable);
	expect(foreignKeys[columnTypesTable.columns.string.name]['REFERENCED_TABLE_NAME']).toBe(userTable.name);
	expect(foreignKeys[columnTypesTable.columns.string.name]['REFERENCED_COLUMN_NAME']).toBe('id');
	
	const uniqueColumns = await tableManager.schemaMetadata.getUniqueColumns(columnTypesTable);
	expect(uniqueColumns.includes(columnTypesTable.columns.uuid.name)).toBeTruthy();
});

test('alter column name', async () => {
	const userTable = new UserTable();
	await tableManager.loadTable(userTable);
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(userTable.name)).toBeTruthy();
	expect(await tableManager.schemaMetadata.columnExists(userTable.columns.name.name, userTable)).toBeTruthy();
	userTable.columns.name.oldName = 'name';
	userTable.columns.name.name = 'namo';
	await tableManager.loadTable(userTable);
	expect(await tableManager.schemaMetadata.columnExists('namo', userTable)).toBeTruthy();
	expect(await tableManager.schemaMetadata.columnExists('name', userTable)).toBeFalsy();
});

test('alter column types', async () => {
	const userTable = new UserTable();
	const columnTypesTable = new ColumnTypesTable();
	await tableManager.loadTable(userTable);
	await tableManager.loadTable(columnTypesTable);
	const columnTypesTableIndexes = await tableManager.schemaMetadata.getIndexes(columnTypesTable);
	console.log(`columnTypesTableIndexes:\n${JSON.stringify(columnTypesTableIndexes, null, 2)}`)
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(userTable.name)).toBeTruthy();
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(columnTypesTable.name)).toBeTruthy();
	columnTypesTable.columns.integer = new BigIntegerColumn('integer', { nullable: true });
	columnTypesTable.columns.bigInteger = new IntegerColumn('big_integer', { nullable: false });
	columnTypesTable.columns.text = new StringColumn('text');
	// TestColumnTypesTable.columns.string = new UuidColumn('string', { references: { table: 'user', column: 'id' } });
	columnTypesTable.columns.float = new DecimalColumn('float', { defaultValue: async () => 0.5 });
	columnTypesTable.columns.decimal = new FloatColumn('decimal');
	columnTypesTable.columns.boolean = new IntegerColumn('boolean');
	(columnTypesTable as Table<any>).columns.date = new DateTimeColumn('date');
	columnTypesTable.columns.dateTime = new DateColumn('date_time');
	columnTypesTable.columns.binary = new StringColumn('binary');
	columnTypesTable.columns.uuid = new StringColumn('uuid', { unique: { unique: true } });
	await tableManager.loadTable(columnTypesTable);
	const columnMetadata = await tableManager.schemaMetadata.getColumnMetadata(columnTypesTable);
	expect(columnMetadata[columnTypesTable.columns.integer.name]['DATA_TYPE']).toBe('bigint');
	expect(columnMetadata[columnTypesTable.columns.bigInteger.name]['DATA_TYPE']).toBe('int');
	expect(columnMetadata[columnTypesTable.columns.text.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[columnTypesTable.columns.string.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[columnTypesTable.columns.float.name]['DATA_TYPE']).toBe('decimal');
	expect(columnMetadata[columnTypesTable.columns.decimal.name]['DATA_TYPE']).toBe('float');
	expect(columnMetadata[columnTypesTable.columns.boolean.name]['DATA_TYPE']).toBe('int');
	expect(columnMetadata[columnTypesTable.columns.date.name]['DATA_TYPE']).toBe('datetime');
	expect(columnMetadata[columnTypesTable.columns.dateTime.name]['DATA_TYPE']).toBe('date');
	expect(columnMetadata[columnTypesTable.columns.binary.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[columnTypesTable.columns.object.name]['DATA_TYPE']).toBe('mediumtext');
	expect(columnMetadata[columnTypesTable.columns.uuid.name]['DATA_TYPE']).toBe('varchar');
	const foreignKeys = await tableManager.schemaMetadata.getForeignKeys(columnTypesTable);
	const uniqueColumns = await tableManager.schemaMetadata.getUniqueColumns(columnTypesTable);
	expect(columnMetadata[columnTypesTable.columns.integer.name]['IS_NULLABLE']).toBe('YES');
	expect(columnMetadata[columnTypesTable.columns.bigInteger.name]['IS_NULLABLE']).toBe('NO');
	// expect(parseFloat(columnMetadata[TestColumnTypesTable.columns.float.name]['COLUMN_DEFAULT'])).toBe(0.5);
	expect(foreignKeys[columnTypesTable.columns.string.name]['REFERENCED_TABLE_NAME']).toBe(userTable.name);
	expect(foreignKeys[columnTypesTable.columns.string.name]['REFERENCED_COLUMN_NAME']).toBe('id');
	expect(uniqueColumns.includes(columnTypesTable.columns.uuid.name)).toBeTruthy();
});

test('alter column options', async () => {
	const userTable = new UserTable();
	const columnTypesTable = new ColumnTypesTable();
	await tableManager.loadTable(userTable);
	columnTypesTable.columns.text.options = { defaultValue: async () => 'asdf' };
	(columnTypesTable as Table<any>).columns['string2'] = new StringColumn('string2', { references: { table: userTable.name, column: userTable.columns.id.name } });
	await tableManager.loadTable(columnTypesTable);
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(userTable.name)).toBeTruthy();
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(columnTypesTable.name)).toBeTruthy();
	let columnMetadata = await tableManager.schemaMetadata.getColumnMetadata(columnTypesTable);
	expect(columnMetadata[columnTypesTable.columns.integer.name]['DATA_TYPE']).toBe('int');
	expect(columnMetadata[columnTypesTable.columns.bigInteger.name]['DATA_TYPE']).toBe('bigint');
	expect(columnMetadata[columnTypesTable.columns.text.name]['DATA_TYPE']).toBe('text');
	expect(columnMetadata[columnTypesTable.columns.string.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[(columnTypesTable as Table<any>).columns.string2.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[columnTypesTable.columns.float.name]['DATA_TYPE']).toBe('float');
	expect(columnMetadata[columnTypesTable.columns.decimal.name]['DATA_TYPE']).toBe('decimal');
	expect(columnMetadata[columnTypesTable.columns.boolean.name]['DATA_TYPE']).toBe('tinyint');
	expect(columnMetadata[columnTypesTable.columns.date.name]['DATA_TYPE']).toBe('date');
	expect(columnMetadata[columnTypesTable.columns.dateTime.name]['DATA_TYPE']).toBe('datetime');
	expect(columnMetadata[columnTypesTable.columns.binary.name]['DATA_TYPE']).toBe('blob');
	expect(columnMetadata[columnTypesTable.columns.object.name]['DATA_TYPE']).toBe('mediumtext');
	expect(columnMetadata[columnTypesTable.columns.uuid.name]['DATA_TYPE']).toBe('char');
	let foreignKeys = await tableManager.schemaMetadata.getForeignKeys(columnTypesTable);
	let uniqueColumns = await tableManager.schemaMetadata.getUniqueColumns(columnTypesTable);
	expect(columnMetadata[columnTypesTable.columns.integer.name]['IS_NULLABLE']).toBe('YES');
	expect(columnMetadata[columnTypesTable.columns.bigInteger.name]['IS_NULLABLE']).toBe('NO');
	// expect(parseFloat(columnMetadata[TestColumnTypesTable.columns.float.name]['COLUMN_DEFAULT'])).toBe(0.5);
	expect(foreignKeys[columnTypesTable.columns.string.name]['REFERENCED_TABLE_NAME']).toBe(userTable.name);
	expect(foreignKeys[columnTypesTable.columns.string.name]['REFERENCED_COLUMN_NAME']).toBe('id');
	expect(uniqueColumns.includes(columnTypesTable.columns.uuid.name)).toBeTruthy();
	columnTypesTable.columns.integer = new IntegerColumn('integer', { nullable: false });
	columnTypesTable.columns.bigInteger = new BigIntegerColumn('big_integer', { nullable: true });
	// columnTypesTable.columns.text = new TextColumn('text', { references: { table: userTable.name, column: 'id' } });
	delete columnTypesTable.columns.string.options?.references;
	((columnTypesTable as Table<any>).columns.string2.options as any).references = { table: userTable.name, column: 'name' };
	columnTypesTable.columns.float = new FloatColumn('float', { defaultValue: async () => 1.5 });
	columnTypesTable.columns.decimal = new DecimalColumn('decimal', { defaultValue: async () => 0 });
	columnTypesTable.columns.uuid = new UuidColumn('uuid', { unique: { unique: false } });
	await tableManager.loadTable(columnTypesTable);
	columnMetadata = await tableManager.schemaMetadata.getColumnMetadata(columnTypesTable);
	expect(columnMetadata[columnTypesTable.columns.integer.name]['DATA_TYPE']).toBe('int');
	expect(columnMetadata[columnTypesTable.columns.bigInteger.name]['DATA_TYPE']).toBe('bigint');
	expect(columnMetadata[columnTypesTable.columns.text.name]['DATA_TYPE']).toBe('text');
	expect(columnMetadata[columnTypesTable.columns.string.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[(columnTypesTable as Table<any>).columns.string2.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[columnTypesTable.columns.float.name]['DATA_TYPE']).toBe('float');
	expect(columnMetadata[columnTypesTable.columns.decimal.name]['DATA_TYPE']).toBe('decimal');
	expect(columnMetadata[columnTypesTable.columns.boolean.name]['DATA_TYPE']).toBe('tinyint');
	expect(columnMetadata[columnTypesTable.columns.date.name]['DATA_TYPE']).toBe('date');
	expect(columnMetadata[columnTypesTable.columns.dateTime.name]['DATA_TYPE']).toBe('datetime');
	expect(columnMetadata[columnTypesTable.columns.binary.name]['DATA_TYPE']).toBe('blob');
	expect(columnMetadata[columnTypesTable.columns.object.name]['DATA_TYPE']).toBe('mediumtext');
	expect(columnMetadata[columnTypesTable.columns.uuid.name]['DATA_TYPE']).toBe('char');
	foreignKeys = await tableManager.schemaMetadata.getForeignKeys(columnTypesTable);
	uniqueColumns = await tableManager.schemaMetadata.getUniqueColumns(columnTypesTable);
	expect(columnMetadata[columnTypesTable.columns.integer.name]['IS_NULLABLE']).toBe('NO');
	expect(columnMetadata[columnTypesTable.columns.bigInteger.name]['IS_NULLABLE']).toBe('YES');
	// expect(parseFloat(columnMetadata[TestColumnTypesTable.columns.float.name]['COLUMN_DEFAULT'])).toBe(1.5);
	// expect(parseFloat(columnMetadata[TestColumnTypesTable.columns.decimal.name]['COLUMN_DEFAULT'])).toBe(0);
	// expect(foreignKeys[TestColumnTypesTable.columns.string.name]).toBeFalsy();
	// expect(foreignKeys[TestColumnTypesTable.columns.string2.name]['REFERENCED_TABLE_NAME']).toBe('user');
	// expect(foreignKeys[TestColumnTypesTable.columns.string2.name]['REFERENCED_COLUMN_NAME']).toBe('name');
	// expect(foreignKeys[TestColumnTypesTable.columns.text.name]['REFERENCED_TABLE_NAME']).toBe('user');
	// expect(foreignKeys[TestColumnTypesTable.columns.text.name]['REFERENCED_COLUMN_NAME']).toBe('id');
	expect(uniqueColumns.includes(columnTypesTable.columns.uuid.name)).toBeFalsy();
});

test('create index', async () => {
	const userTable = new UserTable();
	await tableManager.loadTable(userTable);
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(userTable.name)).toBeTruthy();
	const indexes = await tableManager.schemaMetadata.getIndexes(userTable);
	expect(JSON.stringify(indexes['db_test_user_email_index'])).toBe(JSON.stringify(['email']));
	expect(JSON.stringify(indexes['db_test_user_active_email_index'])).toBe(JSON.stringify(['active', 'email']));
});

test('alter index', async () => {
	const userTable = new UserTable();
	await tableManager.loadTable(userTable);
	expect(await knexDriver.getKnex().schema.withSchema(knexDriver.getDbName()).hasTable(userTable.name)).toBeTruthy();
	let indexes = await tableManager.schemaMetadata.getIndexes(userTable);
	expect(JSON.stringify(indexes['db_test_user_email_index'])).toBe(JSON.stringify(['email']));
	expect(JSON.stringify(indexes['db_test_user_active_email_index'])).toBe(JSON.stringify(['active', 'email']));
	userTable.indexes = [{ columns: ['email'] }, { columns: ['active', 'name'] }];
	await tableManager.loadTable(userTable);
	indexes = await tableManager.schemaMetadata.getIndexes(userTable);
	expect(JSON.stringify(indexes['db_test_user_email_index'])).toBe(JSON.stringify(['email']));
	expect(JSON.stringify(indexes['db_test_user_active_name_index'])).toBe(JSON.stringify(['active', 'name']));
	expect(JSON.stringify(indexes['db_test_user_active_email_index'])).toBeFalsy();
});