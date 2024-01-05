import * as React from 'react';
import { Workflow as WorkflowRecord, WorkflowExecution, WorkflowStep, tables } from '@proteinjs/workflow-common';
import { Reference, getDb } from '@proteinjs/db';
import { WorkflowComponentProps, WorkflowComponentRepo } from './WorkflowComponent';
import { WorkflowHeader } from './WorkflowHeader';
import { PageComponentProps } from '@proteinjs/ui';

export type WorkflowProps = PageComponentProps & {
  workflowId: string,
  workflowExecutionId?: string,
}

export const Workflow = ({ workflowId, workflowExecutionId, ...props }: WorkflowProps) => {
  const [workflowExecution, setWorkflowExecution] = React.useState<WorkflowExecution>();
  const [workflow, setWorkflow] = React.useState<WorkflowRecord>();
  const [steps, setSteps] = React.useState<WorkflowStep[]>();
  const [currentStep, setCurrentStep] = React.useState<WorkflowStep>();
  const [WorkflowComponent, setWorkflowComponent] = React.useState<React.ComponentType<WorkflowComponentProps>>();

  React.useEffect(() => {
    const fetchData = async () => {
      const db = getDb();
      const fetchedWorkflow = await db.get(tables.Workflow, { id: workflowId });
      const fetchedWorkflowExecution = await getOrCreateWorkflowExecution(fetchedWorkflow);
      const fetchedSteps = await fetchedWorkflow?.steps.get();
      const fetchedCurrentStep = await fetchedWorkflowExecution.currentStep.get();
      const newWorkflowComponent = WorkflowComponentRepo.getComponent(workflowId);
      setWorkflowExecution(fetchedWorkflowExecution);
      setWorkflow(fetchedWorkflow);
      setSteps(fetchedSteps);
      setCurrentStep(fetchedCurrentStep);
      setWorkflowComponent(newWorkflowComponent);
    };

    fetchData();
  }, [workflowId, workflowExecutionId]);

  async function getOrCreateWorkflowExecution(workflowRecord: WorkflowRecord) {
    const db = getDb();
    if (workflowExecutionId)
      return await db.get(tables.WorkflowExecution, { id: workflowExecutionId });

    return await db.insert(tables.WorkflowExecution, {
      workflow: Reference.fromObject(tables.Workflow.name, workflowRecord),
      currentStep: Reference.fromObject(tables.WorkflowStep.name, (await workflowRecord.steps.get())[0]),
      status: 'active',
    });
  }

  if (!WorkflowComponent || !workflow || !workflowExecution || !steps || !currentStep)
    return null;
  
  return (
    <WorkflowComponent
      workflowHeader={
        <WorkflowHeader
          workflow={workflow}
          workflowExecution={workflowExecution}
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          {...props}
        />
      }
      workflow={workflow}
      workflowExecution={workflowExecution}
      steps={steps}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      {...props}
    />
  );
}