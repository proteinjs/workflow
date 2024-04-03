import { Fields, FormButtons } from '@proteinjs/ui'
import { Migration, getMigrationRunnerService, tables } from '@proteinjs/db'
import { RecordFormCustomization } from '../RecordFormCustomization'
import { recordFormLink } from '../../pages/RecordFormPage'

export class MigrationRecordFormCustomization extends RecordFormCustomization {
  public table = tables.Migration;
  
  getFormButtons(migration: Migration, defaultFormButtons: FormButtons<any>): FormButtons<any> {
    const formButtons = { ...defaultFormButtons };
    delete formButtons['create'];
    delete formButtons['delete'];
    formButtons['run'] = {
      name: 'Run',
      accessibility: {
        hidden: !migration || migration.status === 'running',
      },
      style: {
        color: 'primary',
        variant: 'contained',
      },
      redirect: async (fields: Fields, buttons: FormButtons<Fields>) => {
        return { path: recordFormLink(this.table.name, migration.id) };
      },
      onClick: async (fields: Fields, buttons: FormButtons<Fields>) => {
        await getMigrationRunnerService().runMigration(migration.id);
        return `Started migration`;
      },
      progressMessage: (fields: Fields) => { return `Starting migration` },
    };
    return formButtons;
  }
}