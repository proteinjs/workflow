import { Logger } from '@brentbahry/util';
import { getSourceRecordLoaders } from './SourceRecord';
import { getTables } from '../Table';
import { getDb } from '../Db';

export async function loadSourceRecords() {
  const logger = new Logger('loadSourceRecords');
  await deleteExistingSourceRecords();
  const sourceRecordLoaders = getSourceRecordLoaders();
  const updateLog: {[table: string]: number} = {};
  const db = getDb();
  for (let sourceRecordLoader of sourceRecordLoaders) {
    sourceRecordLoader.record.isLoadedFromSource = true;
    await db.insert(sourceRecordLoader.table, sourceRecordLoader.record);
    if (!updateLog[sourceRecordLoader.table.name])
      updateLog[sourceRecordLoader.table.name] = 0;

    updateLog[sourceRecordLoader.table.name] += 1;
  }

  for (let table in updateLog)
    logger.info(`[${table}] loaded ${updateLog[table]} ${updateLog[table] > 1 ? 'records' : 'record'} from source`);
}

async function deleteExistingSourceRecords() {
  const db = getDb();
  const tables = getTables();
  for (let table of tables) {
    if (!table.loadRecordsFromSource)
      continue;

    await db.delete(table, { isLoadedFromSource: true });
  }
}