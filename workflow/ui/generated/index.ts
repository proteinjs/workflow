/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import '@brentbahry/util';
import '@mui/icons-material';
import '@mui/material';
import '@proteinjs/db';
import '@proteinjs/ui';
import '@proteinjs/workflow-common';
import 'react';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@proteinjs/workflow-ui/WorkflowComponentProps\",\"value\":{\"packageName\":\"@proteinjs/workflow-ui\",\"name\":\"WorkflowComponentProps\",\"filePath\":\"/Users/brentbahry/repos/components/workflow/ui/src/WorkflowComponent.ts\",\"qualifiedName\":\"@proteinjs/workflow-ui/WorkflowComponentProps\",\"properties\":[{\"name\":\"workflowHeader\",\"type\":{\"packageName\":\"\",\"name\":\"React.ReactNode\",\"filePath\":null,\"qualifiedName\":\"/React.ReactNode\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"workflow\",\"type\":{\"packageName\":\"@proteinjs/workflow-common\",\"name\":\"Workflow\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/workflow-common/Workflow\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"workflowExecution\",\"type\":{\"packageName\":\"@proteinjs/workflow-common\",\"name\":\"WorkflowExecution\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/workflow-common/WorkflowExecution\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"steps\",\"type\":{\"packageName\":\"\",\"name\":\"WorkflowStep[]\",\"filePath\":null,\"qualifiedName\":\"/WorkflowStep[]\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"currentStep\",\"type\":{\"packageName\":\"@proteinjs/workflow-common\",\"name\":\"WorkflowStep\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/workflow-common/WorkflowStep\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"setCurrentStep\",\"type\":{\"packageName\":\"\",\"name\":\"React.Dispatch<React.SetStateAction<WorkflowStep|undefined>>\",\"filePath\":null,\"qualifiedName\":\"/React.Dispatch<React.SetStateAction<WorkflowStep|undefined>>\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"}],\"methods\":[],\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/ui\",\"name\":\"PageComponentProps\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/ui/PageComponentProps\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"sourceType\":3}},{\"v\":\"@proteinjs/ui/PageComponentProps\"},{\"v\":\"@proteinjs/workflow-ui/WorkflowComponent\",\"value\":{\"packageName\":\"@proteinjs/workflow-ui\",\"name\":\"WorkflowComponent\",\"filePath\":\"/Users/brentbahry/repos/components/workflow/ui/src/WorkflowComponent.ts\",\"qualifiedName\":\"@proteinjs/workflow-ui/WorkflowComponent\",\"properties\":[{\"name\":\"workflowId\",\"type\":{\"packageName\":\"\",\"name\":\"string\",\"filePath\":null,\"qualifiedName\":\"/string\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"component\",\"type\":{\"packageName\":\"\",\"name\":\"React.ComponentType<WorkflowComponentProps>\",\"filePath\":null,\"qualifiedName\":\"/React.ComponentType<WorkflowComponentProps>\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"}],\"methods\":[],\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@brentbahry/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@brentbahry/reflection/Loadable\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"sourceType\":3}},{\"v\":\"@brentbahry/reflection/Loadable\"},{\"v\":\"@proteinjs/workflow-ui/WorkflowProps\",\"value\":{\"packageName\":\"@proteinjs/workflow-ui\",\"name\":\"WorkflowProps\",\"filePath\":\"/Users/brentbahry/repos/components/workflow/ui/src/Workflow.tsx\",\"qualifiedName\":\"@proteinjs/workflow-ui/WorkflowProps\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/ui\",\"name\":\"PageComponentProps\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/ui/PageComponentProps\",\"typeParameters\":[],\"directParents\":null},{\"packageName\":\"@proteinjs/workflow-ui\",\"name\":\"{\\n  workflowId: string,\\n  workflowExecutionId?: string,\\n}\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/workflow-ui/{\\n  workflowId: string,\\n  workflowExecutionId?: string,\\n}\",\"typeParameters\":[],\"directParents\":null}],\"sourceType\":1}}],\"edges\":[{\"v\":\"@proteinjs/workflow-ui/WorkflowComponentProps\",\"w\":\"@proteinjs/ui/PageComponentProps\",\"value\":\"extends interface\"},{\"v\":\"@proteinjs/workflow-ui/WorkflowComponent\",\"w\":\"@brentbahry/reflection/Loadable\",\"value\":\"extends interface\"},{\"v\":\"@proteinjs/workflow-ui/WorkflowProps\",\"w\":\"@proteinjs/ui/PageComponentProps\",\"value\":\"extends type\"}]}";


/** Generate Source Links */


const sourceLinks = {
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';