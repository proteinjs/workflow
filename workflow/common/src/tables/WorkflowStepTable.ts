import { Table, StringColumn, SourceRecord, withSourceRecordColumns, ArrayColumn } from '@proteinjs/db';

export interface WorkflowStep extends SourceRecord {
	name: string;
  description: string;
  instructions?: string[];
  prompts?: string[];
}

export class WorkflowStepTable extends Table<WorkflowStep> {
	public name = 'workflow_step';
	public columns = withSourceRecordColumns<WorkflowStep>({
    name: new StringColumn('name'),
    description: new StringColumn('description'),
    instructions: new ArrayColumn<string>('instructions'),
    prompts: new ArrayColumn<string>('prompts'),
	});
};