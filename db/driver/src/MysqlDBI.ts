import knex from 'knex';
import { DBIDriver } from '@proteinjs/db';
import { loadTables } from './loadTables';

export class MysqlDBI implements DBIDriver {
	private static CONFIG = {
		client: 'mysql',
		connection: {
			host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
			user: process.env.DB_USER ? process.env.DB_USER : 'root',
			password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : ''
		}
	};
	private static DB_NAME = process.env.DB_NAME ? process.env.DB_NAME : 'dev';
	private static knex: knex;

	async init(): Promise<void> {
		await this.createDatabaseIfNotExists(MysqlDBI.DB_NAME);
		await this.setMaxAllowedPacketSize();
		await loadTables();
	}

	get(): any {
		if (!MysqlDBI.knex)
			MysqlDBI.knex = knex(MysqlDBI.CONFIG);

		return MysqlDBI.knex;
	}

	databaseName() {
		return MysqlDBI.DB_NAME;
	}

	private async createDatabaseIfNotExists(databaseName: string): Promise<void> {
		if (await this.databaseExists(databaseName))
			return;

		await this.get().raw(`CREATE DATABASE ${databaseName};`);
	}

	private async databaseExists(databaseName: string): Promise<boolean> {
		const result: any = await this.get().raw('SHOW DATABASES;');
		for (const existingDatabase of result[0]) {
			if (existingDatabase['Database'] == databaseName)
                return true;
		}

		return false;
	}

	private async setMaxAllowedPacketSize(): Promise<void> {
		await this.get().raw('SET GLOBAL max_allowed_packet=1073741824;');
		await this.get().destroy();
		MysqlDBI.knex = knex(MysqlDBI.CONFIG);
		console.info('Set global max_allowed_packet size to 1gb');
	}
}