import knex from 'knex';
import { Loadable, SourceRepository } from '@brentbahry/reflection';

export interface DBIDriver extends Loadable {
    init(): Promise<void>;
    get(): knex;
    databaseName(): string;
}

export class DBI {
    private static dbiDriver: DBIDriver;

    private static getDBIDriver(): DBIDriver {
        if (!DBI.dbiDriver) {
            DBI.dbiDriver = SourceRepository.get().object<DBIDriver>('@proteinjs/db/DBIDriver');
            if (!DBI.dbiDriver)
                throw new Error(`Unable to find @proteinjs/db/DBIDriver implementation`);
        }

        return DBI.dbiDriver;
    }

    static async init(): Promise<void> {
        await DBI.getDBIDriver().init();
    }

    static get(): knex {
        return DBI.getDBIDriver().get();
    }

    static databaseName(): string {
        return DBI.getDBIDriver().databaseName();
    }
}