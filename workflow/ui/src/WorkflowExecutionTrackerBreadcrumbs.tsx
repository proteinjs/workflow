import * as React from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Workflow, WorkflowExecution, WorkflowStep } from '@proteinjs/workflow-common';

export type WorkflowExecutionTrackerBreadcrumbsProps = {
  workflow: Workflow,
  workflowExecution: WorkflowExecution,
  steps: WorkflowStep[],
  currentStep: WorkflowStep,
  setCurrentStep: React.Dispatch<React.SetStateAction<WorkflowStep | undefined>>,
}

export const WorkflowExecutionTrackerBreadcrumbs = ({
  workflow, workflowExecution, steps, currentStep, setCurrentStep,
}: WorkflowExecutionTrackerBreadcrumbsProps) => {
  function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  return (
    <>
    { workflowExecution && steps &&
      <Breadcrumbs aria-label='breadcrumb' separator='›'>
        {steps.map((step, index) => {
          const isCurrentStep = step.id == currentStep?.id;

          return isCurrentStep ? (
            <StyledBreadcrumb
              key={index}
              component='a'
              href='#'
              label={step.name}
              clickable
              color='primary'
            />
          ) : (
            <StyledBreadcrumb
              key={index}
              component='a'
              href='#'
              label={step.name}
              onClick={handleClick}
            />
          );
        })}
        <StyledBreadcrumb
          label='Steps'
          deleteIcon={<ExpandMoreIcon />}
          onDelete={handleClick}
        />
      </Breadcrumbs>
    }
    </>
  );
}

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
}) as typeof Chip;
