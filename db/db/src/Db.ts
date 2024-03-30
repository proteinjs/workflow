import { DbService, Query, getDbService } from './services/DbService';
import { Loadable, SourceRepository } from '@brentbahry/reflection';
import { Column, Table, getColumnPropertyName, tableByName } from './Table';
import { Record, RecordSerializer, SerializedRecord } from './Record';
import { Logger } from '@brentbahry/util';
import { loadSourceRecords } from './source/loadSourceRecords';
import { ParameterizationConfig, QueryBuilder, Statement, StatementFactory } from '@proteinjs/db-query';
import { QueryBuilderFactory } from './QueryBuilderFactory';
import { StatementConfigFactory } from './StatementConfigFactory';
import { TableManager } from './schema/TableManager';

export const getDb = () => typeof self === 'undefined' ? new Db() : getDbService() as Db;

export type DbDriverStatementConfig = ParameterizationConfig & { prefixTablesWithDb?: boolean }

export interface DbDriver extends Loadable {
    getDbName(): string;
    createDbIfNotExists(): Promise<void>;
    start?(): Promise<void>;
    stop?(): Promise<void>;
    getTableManager(): TableManager;
    runQuery(generateStatement: (config: DbDriverStatementConfig) => Statement): Promise<SerializedRecord[]>;
    runDml(generateStatement: (config: DbDriverStatementConfig) => Statement): Promise<number>; // returns the number of affected rows
}

export class Db implements DbService {
    private static globalDbDriver: DbDriver;
    private dbDriver: DbDriver;
    private logger = new Logger(this.constructor.name);
    private statementConfigFactory: StatementConfigFactory;

    constructor(
        dbDriver?: DbDriver,
        getTable?: (tableName: string) => Table<any>
    ) {
        this.dbDriver = dbDriver ? dbDriver : this.getGlobalDbDriver();
        this.statementConfigFactory = new StatementConfigFactory(this.dbDriver.getDbName(), getTable);
    }

    private getGlobalDbDriver(): DbDriver {
        if (!Db.globalDbDriver) {
            Db.globalDbDriver = SourceRepository.get().object<DbDriver>('@proteinjs/db/DbDriver');
            if (!Db.globalDbDriver)
                throw new Error(`Unable to find @proteinjs/db/DbDriver implementation. Make sure you've included one as a package dependency.`);
        }

        return Db.globalDbDriver;
    }

    async init(): Promise<void> {
        await this.dbDriver.createDbIfNotExists();
        await this.dbDriver.getTableManager().loadTables();
        await loadSourceRecords();
    }

    async tableExists<T extends Record>(table: Table<T>): Promise<boolean> {
        return await this.dbDriver.getTableManager().tableExists(table);
    }

    async get<T extends Record>(table: Table<T>, query: Query<T>): Promise<T> {
        return (await this.query(table, query))[0];
    }

    async insert<T extends Record>(table: Table<T>, record: Omit<T, keyof Record>): Promise<T> {
        const recordCopy = Object.assign({}, record);
        await this.addDefaultFieldValues(table, recordCopy);
        const recordSearializer = new RecordSerializer(table);
        const serializedRecord = await recordSearializer.serialize(recordCopy);
        const generateInsert = (config: DbDriverStatementConfig) => new StatementFactory<T>().insert(table.name, serializedRecord as Partial<T>, this.statementConfigFactory.getStatementConfig(config));
        await this.dbDriver.runDml(generateInsert);
        return recordCopy as T;
    }

    private async addDefaultFieldValues<T extends Record>(table: Table<T>, record: any) {
        for (let columnPropertyName in table.columns) {
            const column = (table.columns as any)[columnPropertyName] as Column<any, any>;
            if (column.options?.defaultValue && typeof record[columnPropertyName] === 'undefined')
                record[columnPropertyName] = await column.options.defaultValue();
        }
    }

    async update<T extends Record>(table: Table<T>, record: Partial<T>, query?: Query<T>): Promise<number> {
        if (!query && !record.id)
            throw new Error(`Update must be called with either a QueryBuilder or a record with an id property`);

        const recordCopy = Object.assign({}, record);
        await this.addUpdateFieldValues(table, recordCopy);
        const recordSearializer = new RecordSerializer<T>(table);
        const serializedRecord = await recordSearializer.serialize(recordCopy);
        const qb = new QueryBuilderFactory().getQueryBuilder(table, query);
        if (!query)
            qb.condition({ field: 'id', operator: '=', value: recordCopy.id as T[keyof T] });
            
        const generateUpdate = (config: DbDriverStatementConfig) => new StatementFactory<T>().update(table.name, serializedRecord as Partial<T>, qb, this.statementConfigFactory.getStatementConfig(config));
        return await this.dbDriver.runDml(generateUpdate);
    }

    private async addUpdateFieldValues<T extends Record>(table: Table<T>, record: any) {
        for (let columnPropertyName in table.columns) {
            const column = (table.columns as any)[columnPropertyName] as Column<any, any>;
            if (column.options?.updateValue)
                record[columnPropertyName] = await column.options.updateValue();
        }
    }

    async delete<T extends Record>(table: Table<T>, query: Query<T>): Promise<number> {
        const recordsToDelete = await this.query(table, query);
        if (recordsToDelete.length == 0)
            return 0;

        const recordsToDeleteIds = recordsToDelete.map(record => record.id);
        const deleteQb = new QueryBuilderFactory().getQueryBuilder(table);
        deleteQb.condition({ field: 'id', operator: 'IN', value: recordsToDeleteIds as T[keyof T][] });
        const generateDelete = (config: DbDriverStatementConfig) => new StatementFactory<T>().delete(table.name, deleteQb, this.statementConfigFactory.getStatementConfig(config));
        await this.beforeDelete(table, recordsToDelete);
        const deletedRowCount = await this.dbDriver.runDml(generateDelete);
        await this.cascadeDeletions(table, recordsToDeleteIds);
        return deletedRowCount;
    }

    private async beforeDelete(table: Table<any>, recordsToDelete: Record[]) {
        for (let columnPropertyName in table.columns) {
            const column = (table.columns as any)[columnPropertyName] as Column<any, any>;
            if (typeof column.beforeDelete !== 'undefined')
                await column.beforeDelete(table, columnPropertyName, recordsToDelete);
        }
    }

    private async cascadeDeletions(table: Table<any>, deletedRecordIds: string[]) {
        if (table.cascadeDeleteReferences().length < 1)
            return;

        for (let cascadeDeleteReference of table.cascadeDeleteReferences()) {
            const referenceTable = tableByName(cascadeDeleteReference.table);
            const referenceColumnPropertyName = getColumnPropertyName(referenceTable, cascadeDeleteReference.referenceColumn);
            this.logger.info(`Executing cascade delete for table: ${table.name}, referenceTable: ${referenceTable.name}, referenceColumnPropertyName: ${referenceColumnPropertyName}, deletedRecordIds: ${JSON.stringify(deletedRecordIds)}`);
            const cascadeDeleteQb = new QueryBuilderFactory().getQueryBuilder(referenceTable);
            cascadeDeleteQb.condition({ field: referenceColumnPropertyName as string, operator: 'IN', value: deletedRecordIds });
            const deleteCount = await this.delete(referenceTable, cascadeDeleteQb);
            this.logger.info(`Cascade deleted ${deleteCount} record${deleteCount == 1 ? '' : 's'}`);
        }
    }

    async query<T extends Record>(table: Table<T>, query: Query<T>): Promise<T[]> {
        const qb = new QueryBuilderFactory().getQueryBuilder(table, query);
        this.addColumnQueries(table, qb);
        const generateQuery = (config: DbDriverStatementConfig) => qb.toSql(this.statementConfigFactory.getStatementConfig(config));
        const serializedRecords = await this.dbDriver.runQuery(generateQuery);
        const recordSearializer = new RecordSerializer(table);
        return await Promise.all(serializedRecords.map(async (serializedRecord) => recordSearializer.deserialize(serializedRecord)));
    }

    async getRowCount<T extends Record>(table: Table<T>, query?: Query<T>): Promise<number> {
        const qb = new QueryBuilderFactory().getQueryBuilder(table, query);
        qb.aggregate({ function: 'COUNT', resultProp: 'count' });
        this.addColumnQueries(table, qb);
        const generateQuery = (config: DbDriverStatementConfig) => qb.toSql(this.statementConfigFactory.getStatementConfig(config));
        const result = await this.dbDriver.runQuery(generateQuery);
        return result[0]['count'];
    }

    private async addColumnQueries<T extends Record>(table: Table<T>, qb: QueryBuilder<T>) {
        for (let columnPropertyName in table.columns) {
            const column = (table.columns as any)[columnPropertyName] as Column<any, any>;
            if (column.options?.addToQuery)
                column.options.addToQuery(qb);
        }
    }
}