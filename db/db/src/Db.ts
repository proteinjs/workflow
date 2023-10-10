import { DbService } from './services/DbService';
import { Loadable, SourceRepository } from '@brentbahry/reflection';
import { Table } from './Table';
import { Query, QuerySerializer, SerializedQuery } from './Query';
import { Record, RecordSerializer, Row } from './Record';

export interface DbDriver extends Loadable {
    init(): Promise<void>;
    tableExists<T extends Record>(table: Table<T>): Promise<boolean>;
    get<T extends Record>(table: Table<T>, query: SerializedQuery): Promise<Row>;
    insert<T extends Record>(table: Table<T>, row: Row): Promise<Row>;
    update<T extends Record>(table: Table<T>, row: Row, query: SerializedQuery): Promise<void>;
    delete<T extends Record>(table: Table<T>, query: SerializedQuery): Promise<void>;
    query<T extends Record>(table: Table<T>, query: SerializedQuery): Promise<Row[]>;
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
        const row = await Db.getDbDriver().get(table, query);
        const recordSearializer = new RecordSerializer(table);
        return await recordSearializer.deserialize(row);
    }

    async insert<T extends Record>(table: Table<T>, record: Omit<T, keyof Record>): Promise<T> {
        const recordSearializer = new RecordSerializer(table);
        const row = await recordSearializer.serialize(record);
        const rowWithId = await Db.getDbDriver().insert(table, row);
        return await recordSearializer.deserialize(rowWithId);
    }

    async update<T extends Record>(table: Table<T>, record: T, query: Query<T>): Promise<void> {
        const recordSearializer = new RecordSerializer(table);
        const row = await recordSearializer.serialize(record);
        const querySerializer = new QuerySerializer(table);
        const serializedQuery = querySerializer.serializeQuery(query);
        await Db.getDbDriver().update(table, row, serializedQuery);
    }

    async delete<T extends Record>(table: Table<T>, query: Query<T>): Promise<void> {
        const querySerializer = new QuerySerializer(table);
        const serializedQuery = querySerializer.serializeQuery(query);
        await Db.getDbDriver().delete(table, serializedQuery);
    }

    async query<T extends Record>(table: Table<T>, query: Query<T>): Promise<T[]> {
        const querySerializer = new QuerySerializer(table);
        const serializedQuery = querySerializer.serializeQuery(query);
        const rows = await Db.getDbDriver().query(table, serializedQuery);
        const recordSearializer = new RecordSerializer(table);
        return await Promise.all(rows.map(async (row) => recordSearializer.deserialize(row)));
    }
}