import { Table } from '@proteinjs/db';
import { Workflow, WorkflowTable } from './WorkflowTable';
import { WorkflowStep, WorkflowStepTable } from './WorkflowStepTable';
import { WorkflowExecution, WorkflowExecutionTable } from './WorkflowExecutionTable';

export const tables = {
  Workflow: new WorkflowTable() as Table<Workflow>,
  WorkflowStep: new WorkflowStepTable() as Table<WorkflowStep>,
  WorkflowExecution: new WorkflowExecutionTable() as Table<WorkflowExecution>,
};
