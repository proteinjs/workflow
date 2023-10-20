import '../generated/index';
import { Table, StringColumn, BooleanColumn, ObjectColumn, IntegerColumn, BigIntegerColumn, TextColumn, FloatColumn, DecimalColumn, DateColumn, DateTimeColumn, BinaryColumn, UuidColumn, Record, withRecordColumns } from '@proteinjs/db';
import { loadTable, columnExists, getColumnMetadata, getPrimaryKey, getForeignKeys, getUniqueColumns, getIndexes } from '../src/loadTables';
import { MysqlDriver } from '../src/MysqlDriver';

type User = Record & {
	name: string,
	email: string,
	active: boolean,
};

function userTable(): Table<User> {
	return {
		__serializerId: 'n/a',
		name: 'db_test_user',
		columns: withRecordColumns<User>({
			name: new StringColumn('name'),
			email: new StringColumn('email'),
			active: new BooleanColumn('active'),
		}),
		primaryKey: ['id'],
		indexes: [
			{ columns: ['email'] },
			{ columns: ['active', 'email'] }
		]
	}
};

function testColumnTypesTable(): Table<any> {
	return  {
		__serializerId: 'n/a',
		name: 'db_test_column_types',
		columns: {
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
		},
		primaryKey: ['uuid'],
		indexes: [],
	}
};

beforeAll(async () => {
	await new MysqlDriver().init();
})

afterAll(async () => {
	await MysqlDriver.getKnex().destroy();
});

test('create primary key', async () => {
	const UserTable = userTable();
	await loadTable(UserTable);
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(UserTable.name)).toBeTruthy();
	const primaryKey = await getPrimaryKey(UserTable);
	expect(primaryKey[0]).toBe('id');
	expect(primaryKey.length).toBe(1);
	try {
		await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(UserTable.name);
	} catch (error) {
		console.log(`Catching error wheen dropping table: ${UserTable.name}, error: ${error}`);
	}
	expect(await MysqlDriver.getKnex().schema.hasTable(UserTable.name)).toBeFalsy();
});

test('alter primary key', async () => {
	const UserTable = userTable();
	await loadTable(UserTable);
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(UserTable.name)).toBeTruthy();
	let primaryKey = await getPrimaryKey(UserTable);
	expect(primaryKey[0]).toBe('id');
	expect(primaryKey.length).toBe(1);
	UserTable.primaryKey = ['name', 'email'];
	await loadTable(UserTable);
	primaryKey = await getPrimaryKey(UserTable);
	expect(primaryKey[0]).toBe('name');
	expect(primaryKey[1]).toBe('email');
	expect(primaryKey.length).toBe(2);
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(UserTable.name);
	expect(await MysqlDriver.getKnex().schema.hasTable(UserTable.name)).toBeFalsy();
});

test('create columns', async () => {
	const UserTable = userTable();
	await loadTable(UserTable);
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(UserTable.name)).toBeTruthy();
	expect(await columnExists(UserTable.name, UserTable.columns.name.name)).toBeTruthy();
	expect(await columnExists(UserTable.name, UserTable.columns.email.name)).toBeTruthy();
	expect(await columnExists(UserTable.name, UserTable.columns.active.name)).toBeTruthy();
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(UserTable.name);
	expect(await MysqlDriver.getKnex().schema.hasTable(UserTable.name)).toBeFalsy();
});

test('add column via alter', async () => {
	const UserTable = userTable();
	const dataColumn = new ObjectColumn('data');
	await loadTable(UserTable);
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(UserTable.name)).toBeTruthy();
	expect(await columnExists(UserTable.name, UserTable.columns.name.name)).toBeTruthy();
	expect(await columnExists(UserTable.name, UserTable.columns.email.name)).toBeTruthy();
	expect(await columnExists(UserTable.name, UserTable.columns.active.name)).toBeTruthy();
	expect(await columnExists(UserTable.name, dataColumn.name)).toBeFalsy();
	(UserTable as Table<any>).columns['data'] = dataColumn;
	await loadTable(UserTable);
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(UserTable.name)).toBeTruthy();
	expect(await columnExists(UserTable.name, UserTable.columns.name.name)).toBeTruthy();
	expect(await columnExists(UserTable.name, UserTable.columns.email.name)).toBeTruthy();
	expect(await columnExists(UserTable.name, UserTable.columns.active.name)).toBeTruthy();
	expect(await columnExists(UserTable.name, dataColumn.name)).toBeTruthy();
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(UserTable.name);
	expect(await MysqlDriver.getKnex().schema.hasTable(UserTable.name)).toBeFalsy();
});

test('columns created with correct types', async () => {
	const TestColumnTypesTable = testColumnTypesTable();
	await loadTable(TestColumnTypesTable);
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(TestColumnTypesTable.name)).toBeTruthy();
	const columnMetadata = await getColumnMetadata(TestColumnTypesTable);
	expect(columnMetadata[TestColumnTypesTable.columns.integer.name]['DATA_TYPE']).toBe('int');
	expect(columnMetadata[TestColumnTypesTable.columns.bigInteger.name]['DATA_TYPE']).toBe('bigint');
	expect(columnMetadata[TestColumnTypesTable.columns.text.name]['DATA_TYPE']).toBe('text');
	expect(columnMetadata[TestColumnTypesTable.columns.string.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[TestColumnTypesTable.columns.float.name]['DATA_TYPE']).toBe('float');
	expect(columnMetadata[TestColumnTypesTable.columns.decimal.name]['DATA_TYPE']).toBe('decimal');
	expect(columnMetadata[TestColumnTypesTable.columns.boolean.name]['DATA_TYPE']).toBe('tinyint');
	expect(columnMetadata[TestColumnTypesTable.columns.date.name]['DATA_TYPE']).toBe('date');
	expect(columnMetadata[TestColumnTypesTable.columns.dateTime.name]['DATA_TYPE']).toBe('datetime');
	expect(columnMetadata[TestColumnTypesTable.columns.binary.name]['DATA_TYPE']).toBe('blob');
	expect(columnMetadata[TestColumnTypesTable.columns.object.name]['DATA_TYPE']).toBe('mediumtext');
	expect(columnMetadata[TestColumnTypesTable.columns.uuid.name]['DATA_TYPE']).toBe('char');
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(TestColumnTypesTable.name);
	expect(await MysqlDriver.getKnex().schema.hasTable(TestColumnTypesTable.name)).toBeFalsy();
});

test('columns created with correct options', async () => {
	const UserTable = userTable();
	const TestColumnTypesTable = testColumnTypesTable();
	await loadTable(UserTable);
	await loadTable(TestColumnTypesTable);
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(UserTable.name)).toBeTruthy();
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(TestColumnTypesTable.name)).toBeTruthy();
	
	const columnMetadata = await getColumnMetadata(TestColumnTypesTable);
	expect(columnMetadata[TestColumnTypesTable.columns.integer.name]['IS_NULLABLE']).toBe('YES');
	expect(columnMetadata[TestColumnTypesTable.columns.bigInteger.name]['IS_NULLABLE']).toBe('NO');
	// expect(parseFloat(columnMetadata[TestColumnTypesTable.columns.float.name]['COLUMN_DEFAULT'])).toBe(0.5);
	
	const foreignKeys = await getForeignKeys(TestColumnTypesTable);
	expect(foreignKeys[TestColumnTypesTable.columns.string.name]['REFERENCED_TABLE_NAME']).toBe(UserTable.name);
	expect(foreignKeys[TestColumnTypesTable.columns.string.name]['REFERENCED_COLUMN_NAME']).toBe('id');
	
	const uniqueColumns = await getUniqueColumns(TestColumnTypesTable);
	expect(uniqueColumns.includes(TestColumnTypesTable.columns.uuid.name)).toBeTruthy();
	
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(TestColumnTypesTable.name);
	expect(await MysqlDriver.getKnex().schema.hasTable(TestColumnTypesTable.name)).toBeFalsy();
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(UserTable.name);
	expect(await MysqlDriver.getKnex().schema.hasTable(UserTable.name)).toBeFalsy();
});

test('alter column name', async () => {
	const UserTable = userTable();
	await loadTable(UserTable);
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(UserTable.name)).toBeTruthy();
	expect(await columnExists(UserTable.name, UserTable.columns.name.name)).toBeTruthy();
	UserTable.columns.name.oldName = 'name';
	UserTable.columns.name.name = 'namo';
	await loadTable(UserTable);
	expect(await columnExists(UserTable.name, 'namo')).toBeTruthy();
	expect(await columnExists(UserTable.name, 'name')).toBeFalsy();
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(UserTable.name);
	expect(await MysqlDriver.getKnex().schema.hasTable(UserTable.name)).toBeFalsy();
});

test('alter column types', async () => {
	const UserTable = userTable();
	const TestColumnTypesTable = testColumnTypesTable();
	await loadTable(UserTable);
	await loadTable(TestColumnTypesTable);
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(UserTable.name)).toBeTruthy();
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(TestColumnTypesTable.name)).toBeTruthy();
	TestColumnTypesTable.columns.integer = new BigIntegerColumn('integer', { nullable: true });
	TestColumnTypesTable.columns.bigInteger = new IntegerColumn('big_integer', { nullable: false });
	TestColumnTypesTable.columns.text = new StringColumn('text');
	// TestColumnTypesTable.columns.string = new UuidColumn('string', { references: { table: 'user', column: 'id' } });
	TestColumnTypesTable.columns.float = new DecimalColumn('float', { defaultValue: async () => 0.5 });
	TestColumnTypesTable.columns.decimal = new FloatColumn('decimal');
	TestColumnTypesTable.columns.boolean = new IntegerColumn('boolean');
	TestColumnTypesTable.columns.date = new DateTimeColumn('date');
	TestColumnTypesTable.columns.dateTime = new DateColumn('date_time');
	TestColumnTypesTable.columns.binary = new StringColumn('binary');
	TestColumnTypesTable.columns.uuid = new StringColumn('uuid', { unique: { unique: true } });
	await loadTable(TestColumnTypesTable);
	const columnMetadata = await getColumnMetadata(TestColumnTypesTable);
	expect(columnMetadata[TestColumnTypesTable.columns.integer.name]['DATA_TYPE']).toBe('bigint');
	expect(columnMetadata[TestColumnTypesTable.columns.bigInteger.name]['DATA_TYPE']).toBe('int');
	expect(columnMetadata[TestColumnTypesTable.columns.text.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[TestColumnTypesTable.columns.string.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[TestColumnTypesTable.columns.float.name]['DATA_TYPE']).toBe('decimal');
	expect(columnMetadata[TestColumnTypesTable.columns.decimal.name]['DATA_TYPE']).toBe('float');
	expect(columnMetadata[TestColumnTypesTable.columns.boolean.name]['DATA_TYPE']).toBe('int');
	expect(columnMetadata[TestColumnTypesTable.columns.date.name]['DATA_TYPE']).toBe('datetime');
	expect(columnMetadata[TestColumnTypesTable.columns.dateTime.name]['DATA_TYPE']).toBe('date');
	expect(columnMetadata[TestColumnTypesTable.columns.binary.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[TestColumnTypesTable.columns.object.name]['DATA_TYPE']).toBe('mediumtext');
	expect(columnMetadata[TestColumnTypesTable.columns.uuid.name]['DATA_TYPE']).toBe('varchar');
	const foreignKeys = await getForeignKeys(TestColumnTypesTable);
	const uniqueColumns = await getUniqueColumns(TestColumnTypesTable);
	expect(columnMetadata[TestColumnTypesTable.columns.integer.name]['IS_NULLABLE']).toBe('YES');
	expect(columnMetadata[TestColumnTypesTable.columns.bigInteger.name]['IS_NULLABLE']).toBe('NO');
	// expect(parseFloat(columnMetadata[TestColumnTypesTable.columns.float.name]['COLUMN_DEFAULT'])).toBe(0.5);
	expect(foreignKeys[TestColumnTypesTable.columns.string.name]['REFERENCED_TABLE_NAME']).toBe(UserTable.name);
	expect(foreignKeys[TestColumnTypesTable.columns.string.name]['REFERENCED_COLUMN_NAME']).toBe('id');
	expect(uniqueColumns.includes(TestColumnTypesTable.columns.uuid.name)).toBeTruthy();
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(TestColumnTypesTable.name);
	expect(await MysqlDriver.getKnex().schema.hasTable(TestColumnTypesTable.name)).toBeFalsy();
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(UserTable.name);
	expect(await MysqlDriver.getKnex().schema.hasTable(UserTable.name)).toBeFalsy();
});

test('alter column options', async () => {
	const UserTable = userTable();
	const TestColumnTypesTable = testColumnTypesTable();
	await loadTable(UserTable);
	TestColumnTypesTable.columns.text.options = { defaultValue: async () => 'asdf' };
	TestColumnTypesTable.columns['string2'] = new StringColumn('string2', { references: { table: 'user', column: 'id' } });
	await loadTable(TestColumnTypesTable);
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(UserTable.name)).toBeTruthy();
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(TestColumnTypesTable.name)).toBeTruthy();
	let columnMetadata = await getColumnMetadata(TestColumnTypesTable);
	expect(columnMetadata[TestColumnTypesTable.columns.integer.name]['DATA_TYPE']).toBe('int');
	expect(columnMetadata[TestColumnTypesTable.columns.bigInteger.name]['DATA_TYPE']).toBe('bigint');
	expect(columnMetadata[TestColumnTypesTable.columns.text.name]['DATA_TYPE']).toBe('text');
	expect(columnMetadata[TestColumnTypesTable.columns.string.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[TestColumnTypesTable.columns.string2.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[TestColumnTypesTable.columns.float.name]['DATA_TYPE']).toBe('float');
	expect(columnMetadata[TestColumnTypesTable.columns.decimal.name]['DATA_TYPE']).toBe('decimal');
	expect(columnMetadata[TestColumnTypesTable.columns.boolean.name]['DATA_TYPE']).toBe('tinyint');
	expect(columnMetadata[TestColumnTypesTable.columns.date.name]['DATA_TYPE']).toBe('date');
	expect(columnMetadata[TestColumnTypesTable.columns.dateTime.name]['DATA_TYPE']).toBe('datetime');
	expect(columnMetadata[TestColumnTypesTable.columns.binary.name]['DATA_TYPE']).toBe('blob');
	expect(columnMetadata[TestColumnTypesTable.columns.object.name]['DATA_TYPE']).toBe('mediumtext');
	expect(columnMetadata[TestColumnTypesTable.columns.uuid.name]['DATA_TYPE']).toBe('char');
	let foreignKeys = await getForeignKeys(TestColumnTypesTable);
	let uniqueColumns = await getUniqueColumns(TestColumnTypesTable);
	expect(columnMetadata[TestColumnTypesTable.columns.integer.name]['IS_NULLABLE']).toBe('YES');
	expect(columnMetadata[TestColumnTypesTable.columns.bigInteger.name]['IS_NULLABLE']).toBe('NO');
	// expect(parseFloat(columnMetadata[TestColumnTypesTable.columns.float.name]['COLUMN_DEFAULT'])).toBe(0.5);
	expect(foreignKeys[TestColumnTypesTable.columns.string.name]['REFERENCED_TABLE_NAME']).toBe(UserTable.name);
	expect(foreignKeys[TestColumnTypesTable.columns.string.name]['REFERENCED_COLUMN_NAME']).toBe('id');
	expect(uniqueColumns.includes(TestColumnTypesTable.columns.uuid.name)).toBeTruthy();
	TestColumnTypesTable.columns.integer = new IntegerColumn('integer', { nullable: false });
	TestColumnTypesTable.columns.bigInteger = new BigIntegerColumn('big_integer', { nullable: true });
	TestColumnTypesTable.columns.text = new TextColumn('text', { references: { table: UserTable.name, column: 'id' } });
	delete TestColumnTypesTable.columns.string.options?.references;
	(TestColumnTypesTable.columns.string2.options as any).references = { table: UserTable.name, column: 'name' };
	TestColumnTypesTable.columns.float = new FloatColumn('float', { defaultValue: async () => 1.5 });
	TestColumnTypesTable.columns.decimal = new DecimalColumn('decimal', { defaultValue: async () => 0 });
	TestColumnTypesTable.columns.uuid = new UuidColumn('uuid', { unique: { unique: false } });
	await loadTable(TestColumnTypesTable);
	columnMetadata = await getColumnMetadata(TestColumnTypesTable);
	expect(columnMetadata[TestColumnTypesTable.columns.integer.name]['DATA_TYPE']).toBe('int');
	expect(columnMetadata[TestColumnTypesTable.columns.bigInteger.name]['DATA_TYPE']).toBe('bigint');
	expect(columnMetadata[TestColumnTypesTable.columns.text.name]['DATA_TYPE']).toBe('text');
	expect(columnMetadata[TestColumnTypesTable.columns.string.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[TestColumnTypesTable.columns.string2.name]['DATA_TYPE']).toBe('varchar');
	expect(columnMetadata[TestColumnTypesTable.columns.float.name]['DATA_TYPE']).toBe('float');
	expect(columnMetadata[TestColumnTypesTable.columns.decimal.name]['DATA_TYPE']).toBe('decimal');
	expect(columnMetadata[TestColumnTypesTable.columns.boolean.name]['DATA_TYPE']).toBe('tinyint');
	expect(columnMetadata[TestColumnTypesTable.columns.date.name]['DATA_TYPE']).toBe('date');
	expect(columnMetadata[TestColumnTypesTable.columns.dateTime.name]['DATA_TYPE']).toBe('datetime');
	expect(columnMetadata[TestColumnTypesTable.columns.binary.name]['DATA_TYPE']).toBe('blob');
	expect(columnMetadata[TestColumnTypesTable.columns.object.name]['DATA_TYPE']).toBe('mediumtext');
	expect(columnMetadata[TestColumnTypesTable.columns.uuid.name]['DATA_TYPE']).toBe('char');
	foreignKeys = await getForeignKeys(TestColumnTypesTable);
	uniqueColumns = await getUniqueColumns(TestColumnTypesTable);
	expect(columnMetadata[TestColumnTypesTable.columns.integer.name]['IS_NULLABLE']).toBe('NO');
	expect(columnMetadata[TestColumnTypesTable.columns.bigInteger.name]['IS_NULLABLE']).toBe('YES');
	// expect(parseFloat(columnMetadata[TestColumnTypesTable.columns.float.name]['COLUMN_DEFAULT'])).toBe(1.5);
	// expect(parseFloat(columnMetadata[TestColumnTypesTable.columns.decimal.name]['COLUMN_DEFAULT'])).toBe(0);
	// expect(foreignKeys[TestColumnTypesTable.columns.string.name]).toBeFalsy();
	// expect(foreignKeys[TestColumnTypesTable.columns.string2.name]['REFERENCED_TABLE_NAME']).toBe('user');
	// expect(foreignKeys[TestColumnTypesTable.columns.string2.name]['REFERENCED_COLUMN_NAME']).toBe('name');
	// expect(foreignKeys[TestColumnTypesTable.columns.text.name]['REFERENCED_TABLE_NAME']).toBe('user');
	// expect(foreignKeys[TestColumnTypesTable.columns.text.name]['REFERENCED_COLUMN_NAME']).toBe('id');
	expect(uniqueColumns.includes(TestColumnTypesTable.columns.uuid.name)).toBeFalsy();
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(TestColumnTypesTable.name);
	expect(await MysqlDriver.getKnex().schema.hasTable(TestColumnTypesTable.name)).toBeFalsy();
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(UserTable.name);
	expect(await MysqlDriver.getKnex().schema.hasTable(UserTable.name)).toBeFalsy();
});

test('create index', async () => {
	const UserTable = userTable();
	await loadTable(UserTable);
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(UserTable.name)).toBeTruthy();
	const indexes = await getIndexes(UserTable);
	expect(JSON.stringify(indexes['db_test_user_email_index'])).toBe(JSON.stringify(['email']));
	expect(JSON.stringify(indexes['db_test_user_active_email_index'])).toBe(JSON.stringify(['active', 'email']));
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(UserTable.name);
	expect(await MysqlDriver.getKnex().schema.hasTable(UserTable.name)).toBeFalsy();
});

test('alter index', async () => {
	const UserTable = userTable();
	await loadTable(UserTable);
	expect(await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).hasTable(UserTable.name)).toBeTruthy();
	let indexes = await getIndexes(UserTable);
	expect(JSON.stringify(indexes['db_test_user_email_index'])).toBe(JSON.stringify(['email']));
	expect(JSON.stringify(indexes['db_test_user_active_email_index'])).toBe(JSON.stringify(['active', 'email']));
	UserTable.indexes = [{ columns: ['email'] }, { columns: ['active', 'name'] }];
	await loadTable(UserTable);
	indexes = await getIndexes(UserTable);
	expect(JSON.stringify(indexes['db_test_user_email_index'])).toBe(JSON.stringify(['email']));
	expect(JSON.stringify(indexes['db_test_user_active_name_index'])).toBe(JSON.stringify(['active', 'name']));
	expect(JSON.stringify(indexes['db_test_user_active_email_index'])).toBeFalsy();
	await MysqlDriver.getKnex().schema.withSchema(MysqlDriver.getDbName()).dropTable(UserTable.name);
	expect(await MysqlDriver.getKnex().schema.hasTable(UserTable.name)).toBeFalsy();
});