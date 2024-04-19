import * as React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { WorkflowComponentProps } from './WorkflowComponent';
import { WorkflowExecutionTrackerBreadcrumbs } from './WorkflowExecutionTrackerBreadcrumbs';

export const WorkflowHeader = ({ workflow, workflowExecution, steps, currentStep, updateCurrentStep }: Omit<WorkflowComponentProps, 'workflowHeader'>) => {  
  return (
    <Accordion
      sx={{ 
        borderRadius: '0px !important',
        '&:first-of-type': {
          borderRadius: '0px !important',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='workflow-accordion'
        id='workflow-accordion'
      >
        <Typography sx={{ width: '33%', flexShrink: 0 }}>
          { workflow?.name }
        </Typography>
        { workflow && workflowExecution && steps && currentStep &&
          <WorkflowExecutionTrackerBreadcrumbs
            workflow={workflow}
            workflowExecution={workflowExecution}
            steps={steps}
            currentStep={currentStep}
            updateCurrentStep={updateCurrentStep}
          />
        }
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          { currentStep?.description }
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}