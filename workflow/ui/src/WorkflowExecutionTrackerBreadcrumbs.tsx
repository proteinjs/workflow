import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import { Workflow, WorkflowExecution, WorkflowStep } from '@proteinjs/workflow-common';

export type WorkflowExecutionTrackerBreadcrumbsProps = {
  workflow: Workflow,
  workflowExecution: WorkflowExecution,
  steps: WorkflowStep[],
  currentStep: WorkflowStep,
  updateCurrentStep: (step: WorkflowStep) => Promise<void>,
}

export const WorkflowExecutionTrackerBreadcrumbs = ({
  workflow, workflowExecution, steps, currentStep, updateCurrentStep,
}: WorkflowExecutionTrackerBreadcrumbsProps) => {

  function stepsToDisplay() {
    const maxStepsToDisplay = 3;
    const currentStepIndex = indexOfCurrentStep();
    const displaySteps = [];
    const startIndex = currentStepIndex == 0 ?
      0
      :
      currentStepIndex == steps.length - 1 ?
        currentStepIndex - 2
        : 
        currentStepIndex - 1
    ;
    const endIndex = (startIndex + (maxStepsToDisplay - 1)) < steps.length ? startIndex + (maxStepsToDisplay - 1) : steps.length - 1;
    for (let i = startIndex; i <= endIndex; i++)
      displaySteps.push(steps[i]);
    
    return displaySteps;
  }

  function indexOfCurrentStep() {
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].id == currentStep.id)
        return i;
    }

    throw new Error(`Can't fint currentStep in steps`);
  }

  async function handleStepClick(event: React.MouseEvent<Element, MouseEvent>, step: WorkflowStep) {
    event.preventDefault();
    event.stopPropagation();
    await updateCurrentStep(step);
  }

  return (
    <>
    { workflowExecution && steps && currentStep &&
      <Breadcrumbs aria-label='breadcrumb' separator='›'>
        {stepsToDisplay().map((step, index) => {
          const isCurrentStep = step.id == currentStep?.id;

          return isCurrentStep ? (
            <Chip
              key={index}
              label={step.name}
              color='primary'
              sx={(theme) =>({
                height: theme.spacing(3)
              })}
            />
          ) : (
            <Chip
              key={index}
              label={step.name}
              sx={(theme) =>({
                height: theme.spacing(3)
              })}
              onClick={event => handleStepClick(event, step)}
            />
          );
        })}
      </Breadcrumbs>
    }
    </>
  );
}
