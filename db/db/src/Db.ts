import { DbService } from './services/DbService';
import { Loadable, SourceRepository } from '@brentbahry/reflection';
import { Column, Table } from './Table';
import { Query, QuerySerializer, SerializedQuery } from './Query';
import { Record, RecordSerializer, Row } from './Record';

export interface DbDriver extends Loadable {
    init(): Promise<void>;
    tableExists<T extends Record>(table: Table<T>): Promise<boolean>;
    get<T extends Record>(table: Table<T>, query: SerializedQuery): Promise<Row>;
    insert<T extends Record>(table: Table<T>, row: Row): Promise<void>;
    update<T extends Record>(table: Table<T>, row: Row, query: SerializedQuery): Promise<void>;
    delete<T extends Record>(table: Table<T>, query: SerializedQuery): Promise<void>;
    query<T extends Record>(table: Table<T>, query: SerializedQuery, sort?: { column: string, desc?: boolean }[], window?: { start: number, end: number }): Promise<Row[]>;
    getRowCount<T extends Record>(table: Table<T>, query?: SerializedQuery): Promise<number>;
}

export class Db implements DbService {
    private static dbDriver: DbDriver;

    private static getDbDriver(): DbDriver {
        if (!Db.dbDriver) {
            Db.dbDriver = SourceRepository.get().object<DbDriver>('@proteinjs/db/DbDriver');
            if (!Db.dbDriver)
                throw new Error(`Unable to find @proteinjs/db/DbDriver implementation. Make sure you've included one as a package dependency.`);
        }

        return Db.dbDriver;
    }

    async init(): Promise<void> {
        await Db.getDbDriver().init();
    }

    async tableExists<T extends Record>(table: Table<T>): Promise<boolean> {
        return await Db.getDbDriver().tableExists(table);
    }

    async get<T extends Record>(table: Table<T>, query: Query<T>): Promise<T> {
        const querySerializer = new QuerySerializer(table);
        const serializedQuery = querySerializer.serializeQuery(query);
        const row = await Db.getDbDriver().get(table, serializedQuery);
        if (!row)
            return row;
        
        const recordSearializer = new RecordSerializer(table);
        return await recordSearializer.deserialize(row);
    }

    async insert<T extends Record>(table: Table<T>, record: Omit<T, keyof Record>): Promise<T> {
        await this.addDefaultFieldValues(table, record);
        const recordSearializer = new RecordSerializer(table);
        const row = await recordSearializer.serialize(record);
        await Db.getDbDriver().insert(table, row);
        return record as T;
    }

    private async addDefaultFieldValues<T extends Record>(table: Table<T>, record: any) {
        for (let columnPropertyName in table.columns) {
            const column = (table.columns as any)[columnPropertyName] as Column<any, any>;
            if (column.options?.defaultValue && typeof record[columnPropertyName] === 'undefined')
                record[columnPropertyName] = await column.options.defaultValue();
        }
    }

    async update<T extends Record>(table: Table<T>, record: Partial<T>, query?: Query<T>): Promise<void> {
        if (!query && !record.id)
            throw new Error(`Update must be called with either a query or a record with an id property`);

        await this.addUpdateFieldValues(table, record);
        const resolvedQuery: Query<T> = query ? query : { id: record.id } as Query<T>;
        const recordSearializer = new RecordSerializer(table);
        const row = await recordSearializer.serialize(record);
        const querySerializer = new QuerySerializer(table);
        const serializedQuery = querySerializer.serializeQuery(resolvedQuery);
        await Db.getDbDriver().update(table, row, serializedQuery);
    }

    private async addUpdateFieldValues<T extends Record>(table: Table<T>, record: any) {
        for (let columnPropertyName in table.columns) {
            const column = (table.columns as any)[columnPropertyName] as Column<any, any>;
            if (column.options?.updateValue)
                record[columnPropertyName] = await column.options.updateValue();
        }
    }

    async delete<T extends Record>(table: Table<T>, query: Query<T>): Promise<void> {
        const querySerializer = new QuerySerializer(table);
        const serializedQuery = querySerializer.serializeQuery(query);
        const recordsToDelete = await this.query(table, query);
        await this.beforeDelete(table, recordsToDelete);
        await Db.getDbDriver().delete(table, serializedQuery);
    }

    private async beforeDelete(table: Table<any>, records: Record[]) {
        for (let columnPropertyName in table.columns) {
            const column = (table.columns as any)[columnPropertyName] as Column<any, any>;
            if (typeof column.beforeDelete !== 'undefined')
                await column.beforeDelete(table, columnPropertyName, records);
        }
    }

    async query<T extends Record>(table: Table<T>, query: Query<T>, sort?: { column: keyof T, desc?: boolean }[], window?: { start: number, end: number }): Promise<T[]> {
        const querySerializer = new QuerySerializer(table);
        const serializedQuery = querySerializer.serializeQuery(query);
        const rows = await Db.getDbDriver().query(table, serializedQuery, sort?.map(sortCondition => ({ column: table.columns[sortCondition.column].name, desc: sortCondition.desc })), window);
        const recordSearializer = new RecordSerializer(table);
        return await Promise.all(rows.map(async (row) => recordSearializer.deserialize(row)));
    }

    async getRowCount<T extends Record>(table: Table<T>, query?: Query<T>): Promise<number> {
        let serializedQuery;
        if (query) {
            const querySerializer = new QuerySerializer(table);
            serializedQuery = querySerializer.serializeQuery(query);
        }

        return await Db.getDbDriver().getRowCount(table, serializedQuery);
    }
}