import { moment } from './opt/moment';
import { getDb } from './Db';
import { Table } from './Table';
import { SourceRecordRepo } from './source/SourceRecordRepo';
import { MigrationRunnerService, getMigrationRunnerService } from './services/MigrationRunnerService';
import { Migration, MigrationTable } from './tables/MigrationTable';
import { Service } from '@proteinjs/service';

export const getMigrationRunner = () => typeof self === 'undefined' ? new MigrationRunner() : getMigrationRunnerService() as MigrationRunner;

export class MigrationRunner implements MigrationRunnerService {
  public serviceMetadata: Service['serviceMetadata'] = {
    doNotAwait: true,
  };

  async runMigration(id: string): Promise<void> {
    const migrationTable: Table<Migration> = new MigrationTable();
    const migration = new SourceRecordRepo().getSourceRecord<Migration>(migrationTable.name, id);
    if (!migration)
      throw new Error(`Unable to find migration source record for id: ${id}`);

    const db = getDb();
    migration.status = 'running';
    migration.startTime = moment();
    await db.update(migrationTable, migration);
    try {
      await migration.run();
      migration.status = 'success';
    } catch (error: any) {
      migration.failureMessage = error.message;
      migration.failureStack = error.stack;
      migration.status = 'failure';
    } finally {
      migration.endTime = moment();
    }
    await db.update(migrationTable, migration);
  }
}