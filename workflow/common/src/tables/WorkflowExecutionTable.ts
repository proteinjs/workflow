import { Table, StringColumn, Record, withRecordColumns, Reference, ReferenceColumn } from '@proteinjs/db';
import { WorkflowStep, WorkflowStepTable } from './WorkflowStepTable';
import { Workflow, WorkflowTable } from './WorkflowTable';

export interface WorkflowExecution extends Record {
	workflow: Reference<Workflow>;
  currentStep: Reference<WorkflowStep>;
  status: 'pending'|'active'|'success'|'failure';
}

export class WorkflowExecutionTable extends Table<WorkflowExecution> {
	public name = 'workflow_execution';
	public columns = withRecordColumns<WorkflowExecution>({
		workflow: new ReferenceColumn<Workflow>('workflow', new WorkflowTable().name, false),
    currentStep: new ReferenceColumn<WorkflowStep>('current_step', new WorkflowStepTable().name, false),
    status: new StringColumn('status', { defaultValue: async () => 'pending' }),
	});
};