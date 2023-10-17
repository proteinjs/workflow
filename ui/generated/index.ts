/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import '@emotion/react';
import '@emotion/styled';
import '@mui/icons-material';
import '@mui/joy';
import '@mui/material';
import 'history';
import 'query-string';
import 'react';
import 'react-dom';
import 'react-router';
import 'react-router-dom';
import 'string';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@proteinjs/ui/Page\",\"value\":{\"packageName\":\"@proteinjs/ui\",\"name\":\"Page\",\"filePath\":\"/Users/brentbahry/repos/components/ui/src/router/Page.ts\",\"qualifiedName\":\"@proteinjs/ui/Page\",\"properties\":[{\"name\":\"name\",\"type\":{\"packageName\":\"\",\"name\":\"string\",\"filePath\":null,\"qualifiedName\":\"/string\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"path\",\"type\":{\"packageName\":\"\",\"name\":\"string|string[]\",\"filePath\":null,\"qualifiedName\":\"/string|string[]\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"component\",\"type\":{\"packageName\":\"\",\"name\":\"React.ComponentType<{ urlParams: {[key: string]: string} }>\",\"filePath\":null,\"qualifiedName\":\"/React.ComponentType<{ urlParams: {[key: string]: string} }>\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"noPageContainer\",\"type\":{\"packageName\":\"\",\"name\":\"boolean\",\"filePath\":null,\"qualifiedName\":\"/boolean\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"public\",\"type\":{\"packageName\":\"\",\"name\":\"boolean\",\"filePath\":null,\"qualifiedName\":\"/boolean\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"roles\",\"type\":{\"packageName\":\"\",\"name\":\"string[]\",\"filePath\":null,\"qualifiedName\":\"/string[]\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"}],\"methods\":[],\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@brentbahry/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@brentbahry/reflection/Loadable\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"sourceType\":3}},{\"v\":\"@brentbahry/reflection/Loadable\"},{\"v\":\"/React.ComponentType\"},{\"v\":\"/Partial\"},{\"v\":\"/React.Component\"}],\"edges\":[{\"v\":\"@proteinjs/ui/Page\",\"w\":\"@brentbahry/reflection/Loadable\",\"value\":\"extends interface\"}]}";


/** Generate Source Links */


const sourceLinks = {
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';