import {
  Table,
  StringColumn,
  ReferenceArray,
  ReferenceArrayColumn,
  SourceRecord,
  withSourceRecordColumns,
} from '@proteinjs/db';
import { WorkflowStep, WorkflowStepTable } from './WorkflowStepTable';
import moment from 'moment';

export interface Workflow extends SourceRecord {
  name: string;
  description: string;
  steps: ReferenceArray<WorkflowStep>;
}

export class WorkflowTable extends Table<Workflow> {
  public name = 'workflow';
  public auth: Table<Workflow>['auth'] = {
    db: {
      query: 'authenticated',
    },
    service: {
      query: 'authenticated',
    },
  };
  public columns = withSourceRecordColumns<Workflow>({
    name: new StringColumn('name'),
    description: new StringColumn('description'),
    steps: new ReferenceArrayColumn('steps', new WorkflowStepTable().name, true),
  });
}
