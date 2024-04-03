import { SourceRecordLoader } from './source/SourceRecord';
import { Migration } from './tables/MigrationTable';
import { tables } from './tables/tables';

export class TestMigration implements SourceRecordLoader<Migration> {
  table = tables.Migration;
  record = {
    id: 'db7123c0f16511ee9879779c351ec1e8',
    description: 'Testy',
    run: async () => {
      console.log(`Running test migration`);
      await sleep(60000);
      console.log(`Finished running test migration`);
    },
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}