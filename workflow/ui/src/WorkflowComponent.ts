import * as React from 'react'
import { Loadable, SourceRepository } from '@brentbahry/reflection'
import { Workflow, WorkflowExecution, WorkflowStep } from '@proteinjs/workflow-common';
import { PageComponentProps } from '@proteinjs/ui';

export interface WorkflowComponentProps extends PageComponentProps {
  workflowHeader: React.ReactNode;
  workflow: Workflow;
  workflowExecution: WorkflowExecution;
  steps: WorkflowStep[];
  currentStep: WorkflowStep;
  setCurrentStep: React.Dispatch<React.SetStateAction<WorkflowStep|undefined>>;
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