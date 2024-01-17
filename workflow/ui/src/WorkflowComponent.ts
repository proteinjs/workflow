import React, { ReactElement } from 'react'
import { Loadable, SourceRepository } from '@brentbahry/reflection'
import { Workflow, WorkflowExecution, WorkflowStep } from '@proteinjs/workflow-common';
import { PageComponentProps } from '@proteinjs/ui';

export interface WorkflowComponentProps extends PageComponentProps {
  workflowHeader?: ReactElement;
  workflow: Workflow;
  workflowExecution: WorkflowExecution;
  steps: WorkflowStep[];
  currentStep: WorkflowStep;
  updateCurrentStep: (step: WorkflowStep) => Promise<void>;
  setWorkflowExecutionAndCurrentStep: (workflowExecution: WorkflowExecution) => Promise<void>;
}

export interface WorkflowComponent extends Loadable {
  workflowId: string;
  component: React.ComponentType<WorkflowComponentProps>;
}

export class WorkflowComponentRepo {
  private static INSTANCE: WorkflowComponentRepo;
  private constructor(
    private workflowComponentsMap: {[workflowId: string]: WorkflowComponent['component']}
  ) {}

  private static getInstance() {
    if (!WorkflowComponentRepo.INSTANCE) {
      const components = SourceRepository.get().objects<WorkflowComponent>('@proteinjs/workflow-ui/WorkflowComponent');
      const componentsMap: {[workflowId: string]: WorkflowComponent['component']} = {};
      for (let component of components)
        componentsMap[component.workflowId] = component.component;

      WorkflowComponentRepo.INSTANCE = new WorkflowComponentRepo(componentsMap);
    }

    return WorkflowComponentRepo.INSTANCE;
  }

  static getComponent(workflowId: string) {
    return WorkflowComponentRepo.getInstance().workflowComponentsMap[workflowId];
  }
}