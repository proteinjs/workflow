import knex from 'knex';
import { DbDriver, Record, SerializedRecord, Table, TableManager } from '@proteinjs/db';
import { MysqlConfig, getMysqlConfig } from '../MysqlConfig';
import { Logger } from '@brentbahry/util';
import { ParameterizationConfig, Statement } from '@proteinjs/db-query';
import { KnexSchemaMetadata } from './KnexSchemaMetadata';
import { KnexSchemaOperations } from './KnexSchemaOperations';

export class KnexDriver implements DbDriver {
	private static KNEX: knex;
	private logger = new Logger(this.constructor.name);
	private config: MysqlConfig;
	private knexConfig: any;

	constructor(config?: MysqlConfig) {
		this.config = config ? config : getMysqlConfig();
		this.knexConfig = {
			client: 'mysql',
			connection: {
				host: this.config.host,
				user: this.config.user,
				password: this.config.password,
			}
		};
	}

	getKnex(): knex {
		if (!KnexDriver.KNEX)
			KnexDriver.KNEX = knex(this.knexConfig);

		return KnexDriver.KNEX;
	}

	getDbName() {
		return this.config.dbName as string;
	}

	getTableManager() {
		const schemaMetadata = new KnexSchemaMetadata(this);
		const schemaOperations = new KnexSchemaOperations(this);
		return new TableManager(schemaMetadata, schemaOperations);
	}

	async init(): Promise<void> {
		await this.createDatabaseIfNotExists(this.getDbName());
		await this.setMaxAllowedPacketSize();
		await this.getTableManager().loadTables();
	}

	async tableExists<T extends Record>(table: Table<T>): Promise<boolean> {
		return await this.getKnex().schema.withSchema(this.getDbName()).hasTable(table.name);
	}

	private async createDatabaseIfNotExists(databaseName: string): Promise<void> {
		if (await this.databaseExists(databaseName))
			return;

		await this.getKnex().raw(`CREATE DATABASE ${databaseName};`);
	}

	private async databaseExists(databaseName: string): Promise<boolean> {
		const result: any = await this.getKnex().raw('SHOW DATABASES;');
		for (const existingDatabase of result[0]) {
			if (existingDatabase['Database'] == databaseName)
        return true;
		}

		return false;
	}

	private async setMaxAllowedPacketSize(): Promise<void> {
		await this.getKnex().raw('SET GLOBAL max_allowed_packet=1073741824;');
		await this.getKnex().destroy();
		KnexDriver.KNEX = knex(this.knexConfig);
		this.logger.info('Set global max_allowed_packet size to 1gb');
	}

	async insert(generateStatement: (config: ParameterizationConfig) => Statement): Promise<void> {
		await this.executeStatement(generateStatement);
	}
	
	async update(generateStatement: (config: ParameterizationConfig) => Statement): Promise<number> {
		const { affectedRows } = (await this.executeStatement(generateStatement));
		return affectedRows;
	}

	async delete(generateStatement: (config: ParameterizationConfig) => Statement): Promise<number> {
		const { affectedRows } = (await this.executeStatement(generateStatement));
		return affectedRows;
	}

	async query(generateStatement: (config: ParameterizationConfig) => Statement): Promise<SerializedRecord[]> {
		return (await this.executeStatement(generateStatement)); // returns 2 arrays, first is records, second is metadata per record
	}

	async executeStatement(generateStatement: (config: ParameterizationConfig) => Statement): Promise<any> {
		const { sql, params } = generateStatement({ useParams: true });
		try {
			return (await this.getKnex().raw(sql, params as any))[0];
		} catch(error: any) {
			this.logger.error(`Failed when executing: ${sql}`);
			throw error;
		}
	}
}