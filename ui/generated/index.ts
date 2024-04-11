/** Load Dependency Source Graphs */

import '@proteinjs/reflection';
import '@proteinjs/util';
import '@emotion/react';
import '@emotion/styled';
import '@mui/icons-material';
import '@mui/material';
import 'history';
import 'moment';
import 'query-string';
import 'react';
import 'react-dom';
import 'react-router';
import 'react-router-dom';
import 'string';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@proteinjs/ui/Page\",\"value\":{\"packageName\":\"@proteinjs/ui\",\"name\":\"Page\",\"filePath\":\"/Users/brentbahry/repos/components/ui/src/router/Page.ts\",\"qualifiedName\":\"@proteinjs/ui/Page\",\"properties\":[{\"name\":\"name\",\"type\":{\"packageName\":\"\",\"name\":\"string\",\"filePath\":null,\"qualifiedName\":\"/string\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"path\",\"type\":{\"packageName\":\"\",\"name\":\"string|string[]\",\"filePath\":null,\"qualifiedName\":\"/string|string[]\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"component\",\"type\":{\"packageName\":\"\",\"name\":\"React.ComponentType<PageComponentProps>\",\"filePath\":null,\"qualifiedName\":\"/React.ComponentType<PageComponentProps>\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"noPageContainer\",\"type\":{\"packageName\":\"\",\"name\":\"boolean\",\"filePath\":null,\"qualifiedName\":\"/boolean\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"auth\",\"type\":{\"packageName\":\"@proteinjs/ui\",\"name\":\"{\\n        /** If true, the user does not need to be logged in or have any roles to access this page. If blank, defaults to false. */\\n        public?: boolean;\\n        /** If true, the user does not need to have any roles to access this page, but must be logged in. If blank, defaults to false. */\\n        allUsers?: boolean,\\n        /** The user must be logged in and have these roles to access this page. If blank, defaults to requiring the 'admin' role. */\\n        roles?: string[];\\n    }\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/ui/{\\n        /** If true, the user does not need to be logged in or have any roles to access this page. If blank, defaults to false. */\\n        public?: boolean;\\n        /** If true, the user does not need to have any roles to access this page, but must be logged in. If blank, defaults to false. */\\n        allUsers?: boolean,\\n        /** The user must be logged in and have these roles to access this page. If blank, defaults to requiring the 'admin' role. */\\n        roles?: string[];\\n    }\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"pageContainerSxProps\",\"type\":{\"packageName\":\"@mui/material\",\"name\":\"SxProps\",\"filePath\":null,\"qualifiedName\":\"@mui/material/SxProps\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"}],\"methods\":[],\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/reflection/Loadable\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"sourceType\":3}},{\"v\":\"@proteinjs/reflection/Loadable\"},{\"v\":\"/string | React.ComponentType\"},{\"v\":\"/React.FC\"},{\"v\":\"/Partial\"},{\"v\":\"/React.Component\"}],\"edges\":[{\"v\":\"@proteinjs/ui/Page\",\"w\":\"@proteinjs/reflection/Loadable\",\"value\":\"extends interface\"}]}";


/** Generate Source Links */


const sourceLinks = {
};


/** Load Source Graph and Links */

import { SourceRepository } from '@proteinjs/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';