import { Table, StringColumn, SourceRecord, withSourceRecordColumns } from '@proteinjs/db';

export interface WorkflowStep extends SourceRecord {
	name: string;
  description: string;
}

export class WorkflowStepTable extends Table<WorkflowStep> {
	public name = 'workflow_step';
	public columns = withSourceRecordColumns<WorkflowStep>({
    name: new StringColumn('name'),
    description: new StringColumn('description'),
	});
  public loadRecordsFromSource = true;
};