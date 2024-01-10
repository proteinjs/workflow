import React from 'react'
import { Page } from '@proteinjs/ui'
import { Workflow } from '../Workflow';

export const workflowPage: Page = {
  name: 'Workflow',
  path: 'workflow',
  pageContainerSxProps: (theme) => ({ 
    height: '100vh', 
    overflow: 'hidden', 
    display: 'flex', 
    flexDirection: 'column',
  }),
  component: ({...props}) => {
    return (
      <Workflow
        workflowId={props.urlParams['id']}
        workflowExecutionId={props.urlParams['workflow_execution_id']}
        {...props}
      />
    );
  }
}

export const workflowLink = (workflowId: string, workflowExuectionId?: string) => {
  let path = `/${workflowPage.path}?id=${workflowId}`;
  if (workflowExuectionId)
    path += `&workflow_execution_id=${workflowExuectionId}`;

  return path;
}