import { Logger } from '@brentbahry/util';
import { getSourceRecordLoaders, sourceRecordColumns } from './SourceRecord';
import { getTables, Table } from '../Table';
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
    if (!hasSourceRecords(table))
      continue;

    await db.delete(table, { isLoadedFromSource: true });
  }
}

function hasSourceRecords(table: Table<any>) {
  for (let columnPropertyName in table.columns) {
    const column = table.columns[columnPropertyName];
    if (column.name == sourceRecordColumns.isLoadedFromSource.name)
      return true;
  }

  return false;
}