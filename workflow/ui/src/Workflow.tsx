import * as React from 'react';
import { Workflow as WorkflowRecord, WorkflowExecution, WorkflowStep, tables } from '@proteinjs/workflow-common';
import { Reference, getDb } from '@proteinjs/db';
import { WorkflowComponentRepo } from './WorkflowComponent';
import { WorkflowHeader } from './WorkflowHeader';
import { PageComponentProps } from '@proteinjs/ui';
import { workflowLink } from './pages/WorkflowPage';

export type WorkflowProps = PageComponentProps & {
  workflowId: string,
  workflowExecutionId?: string,
}

export const Workflow = ({ workflowId, workflowExecutionId, navigate, ...props }: WorkflowProps) => {
  const [workflowExecution, setWorkflowExecution] = React.useState<WorkflowExecution>();
  const [workflow, setWorkflow] = React.useState<WorkflowRecord>();
  const [steps, setSteps] = React.useState<WorkflowStep[]>();
  const [currentStep, setCurrentStep] = React.useState<WorkflowStep>();
  const WorkflowComponent = WorkflowComponentRepo.getComponent(workflowId);

  React.useEffect(() => {
    const fetchData = async () => {
      const db = getDb();
      const fetchedWorkflow = await db.get(tables.Workflow, { id: workflowId });
      const fetchedWorkflowExecution = await getOrCreateWorkflowExecution(fetchedWorkflow);
      const fetchedSteps = await fetchedWorkflow?.steps.get();
      const fetchedCurrentStep = await fetchedWorkflowExecution.currentStep.get();
      setWorkflowExecution(fetchedWorkflowExecution);
      setWorkflow(fetchedWorkflow);
      setSteps(fetchedSteps);
      setCurrentStep(fetchedCurrentStep);
    };

    fetchData();
  }, [workflowId, workflowExecutionId]);

  async function getOrCreateWorkflowExecution(workflowRecord: WorkflowRecord) {
    const db = getDb();
    if (workflowExecutionId)
      return await db.get(tables.WorkflowExecution, { id: workflowExecutionId });

    const newWorkflowExecution = await db.insert(tables.WorkflowExecution, {
      workflow: Reference.fromObject(tables.Workflow.name, workflowRecord),
      currentStep: Reference.fromObject(tables.WorkflowStep.name, (await workflowRecord.steps.get())[0]),
      status: 'active',
    });
    navigate(workflowLink(workflowId, newWorkflowExecution.id), { replace: true });
    return newWorkflowExecution;
  }

  async function updateCurrentStep(step: WorkflowStep) {
    if (!workflowExecution)
      return;

    workflowExecution.currentStep = Reference.fromObject(tables.WorkflowStep.name, step);
    await getDb().update(tables.WorkflowExecution, workflowExecution);
    setCurrentStep(step);
  }

  async function setWorkflowExecutionAndCurrentStep(workflowExecution: WorkflowExecution) {
    if (workflowExecution.currentStep._id != currentStep?.id) {
      const newCurrentStep = await workflowExecution.currentStep.get();
      setCurrentStep(newCurrentStep);
    }

    setWorkflowExecution(workflowExecution);
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
          updateCurrentStep={updateCurrentStep}
          setWorkflowExecutionAndCurrentStep={setWorkflowExecutionAndCurrentStep}
          navigate={navigate}
          {...props}
        />
      }
      workflow={workflow}
      workflowExecution={workflowExecution}
      steps={steps}
      currentStep={currentStep}
      updateCurrentStep={updateCurrentStep}
      setWorkflowExecutionAndCurrentStep={setWorkflowExecutionAndCurrentStep}
      navigate={navigate}
      {...props}
    />
  );
}