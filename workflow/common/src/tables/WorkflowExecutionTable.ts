import { Table, StringColumn, Reference, ReferenceColumn } from '@proteinjs/db';
import { ScopedRecord, withScopedRecordColumns } from '@proteinjs/user';
import { WorkflowStep, WorkflowStepTable } from './WorkflowStepTable';
import { Workflow, WorkflowTable } from './WorkflowTable';

export interface WorkflowExecution extends ScopedRecord {
	workflow: Reference<Workflow>;
  currentStep: Reference<WorkflowStep>;
  status: 'pending'|'active'|'success'|'failure';
}

export class WorkflowExecutionTable extends Table<WorkflowExecution> {
	public name = 'workflow_execution';
	public columns = withScopedRecordColumns<WorkflowExecution>({
		workflow: new ReferenceColumn<Workflow>('workflow', new WorkflowTable().name, false),
    currentStep: new ReferenceColumn<WorkflowStep>('current_step', new WorkflowStepTable().name, false),
    status: new StringColumn('status', { defaultValue: async () => 'pending' }),
	});
};