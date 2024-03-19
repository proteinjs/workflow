import { Database, Instance, Spanner } from '@google-cloud/spanner';
import { DbDriver, Record, SerializedRecord, Table, TableManager } from '@proteinjs/db';
import { SpannerConfig, getSpannerConfig } from './SpannerConfig';
import { Logger } from '@brentbahry/util';
import { ParameterizationConfig, Statement, QueryBuilder } from '@proteinjs/db-query';
import { KnexSchemaMetadata } from './KnexSchemaMetadata';
import { KnexSchemaOperations } from './KnexSchemaOperations';

export class SpannerDriver implements DbDriver {
	private static SPANNER: Spanner;
	private static SPANNER_INSTANCE: Instance;
	private static SPANNER_DB: Database;
	private logger = new Logger(this.constructor.name);
	private config: SpannerConfig;

	constructor(config?: SpannerConfig) {
		this.config = config ? config : getSpannerConfig();
	}

	private getSpanner(): Spanner {
		if (!SpannerDriver.SPANNER)
			SpannerDriver.SPANNER = new Spanner({ projectId: this.config.projectId });


		return SpannerDriver.SPANNER;
	}

	private getSpannerInstance(): Instance {
		if (!SpannerDriver.SPANNER_INSTANCE)
			SpannerDriver.SPANNER_INSTANCE = this.getSpanner().instance(this.config.instanceName);

		return SpannerDriver.SPANNER_INSTANCE;
	}

	private getSpannerDb(): Database {
		if (!SpannerDriver.SPANNER_DB)
			SpannerDriver.SPANNER_DB = this.getSpannerInstance().database(this.config.databaseName);

		return SpannerDriver.SPANNER_DB;
	}

	getDbName() {
		return this.config.databaseName;
	}

	getTableManager() {
		const schemaMetadata = new KnexSchemaMetadata(this);
		const schemaOperations = new KnexSchemaOperations(this);
		return new TableManager(schemaMetadata, schemaOperations);
	}

	async createDbIfNotExists(): Promise<void> {
		if (await this.dbExists(this.getDbName()))
			return;

		await this.getSpannerInstance().createDatabase(this.getDbName());
	}

	private async dbExists(databaseName: string): Promise<boolean> {
		const [exists] = await this.getSpannerInstance().database(databaseName).exists();
		return exists;
	}

	async tableExists<T extends Record>(table: Table<T>): Promise<boolean> {
		const qb = new QueryBuilder('INFORMATION_SCHEMA.TABLES').condition({ field: 'TABLE_NAME', operator: '=', value: table.name });
		const generateStatement = (config: ParameterizationConfig) => qb.toSql({ dbName: this.getDbName(), ...config });
		const results = await this.runQuery(generateStatement);
		return results.length > 0;
	}

	async runQuery(generateStatement: (config: ParameterizationConfig) => Statement): Promise<any> {
		const { sql, namedParams } = generateStatement({ useParams: true, useNamedParams: true });
		try {
			return (await this.getSpannerDb().run({ sql, params: namedParams?.params }))[0];
		} catch(error: any) {
			this.logger.error(`Failed when executing: ${sql}`);
			throw error;
		}
	}

	/**
	 * Execute a write operation.
	 * 
	 * @returns number of affected rows
	 */
	async runDml(generateStatement: (config: ParameterizationConfig) => Statement): Promise<number> {
		const { sql, namedParams } = generateStatement({ useParams: true, useNamedParams: true });
		try {
			return await this.getSpannerDb().runTransactionAsync(async (transaction) => {
				const [rowCount] = await transaction.runUpdate({
					sql,
					params: namedParams?.params,
				});
				await transaction.commit();
				return rowCount;
			});
		} catch(error: any) {
			this.logger.error(`Failed when executing dml: ${sql}`);
			throw error;
		}
	}
}