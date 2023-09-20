/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import 'history';
import 'query-string';
import 'react';
import 'react-dom';
import 'react-router';
import 'react-router-dom';
import 'string';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@proteinjs/ui/Page\",\"value\":{\"packageName\":\"@proteinjs/ui\",\"name\":\"Page\",\"filePath\":\"/Users/brentbahry/Documents/packages/ui/src/router/Page.ts\",\"qualifiedName\":\"@proteinjs/ui/Page\",\"properties\":[{\"name\":\"name\",\"type\":{\"packageName\":\"\",\"name\":\"string\",\"filePath\":null,\"qualifiedName\":\"/string\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"path\",\"type\":{\"packageName\":\"\",\"name\":\"string\",\"filePath\":null,\"qualifiedName\":\"/string\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"component\",\"type\":{\"packageName\":\"\",\"name\":\"React.ComponentType\",\"filePath\":null,\"qualifiedName\":\"/React.ComponentType\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"redirects\",\"type\":{\"packageName\":\"\",\"name\":\"string[]\",\"filePath\":null,\"qualifiedName\":\"/string[]\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"noPageContainer\",\"type\":{\"packageName\":\"\",\"name\":\"boolean\",\"filePath\":null,\"qualifiedName\":\"/boolean\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"public\",\"type\":{\"packageName\":\"\",\"name\":\"boolean\",\"filePath\":null,\"qualifiedName\":\"/boolean\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"roles\",\"type\":{\"packageName\":\"\",\"name\":\"string[]\",\"filePath\":null,\"qualifiedName\":\"/string[]\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"}],\"methods\":[],\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@brentbahry/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@brentbahry/reflection/Loadable\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"sourceType\":3}},{\"v\":\"@brentbahry/reflection/Loadable\"},{\"v\":\"/React.ComponentType\"},{\"v\":\"@proteinjs/ui/FormProps\",\"value\":{\"packageName\":\"@proteinjs/ui\",\"name\":\"FormProps\",\"filePath\":\"/Users/brentbahry/Documents/packages/ui/src/form/FunctionalForm.tsx\",\"qualifiedName\":\"@proteinjs/ui/FormProps\",\"typeParameters\":[\"/F extends Fields\",\"/B extends FormButtons<F>\"],\"directParents\":[{\"packageName\":\"@proteinjs/ui\",\"name\":\"{\\n    name?: string,\\n    documentation?: React.ComponentType,\\n    createFields: () => F,\\n    fieldLayout?: (keyof F)[]|(keyof F)[][],\\n    buttons: B,\\n    onLoad?: (fields: F, buttons: B) => Promise<void>,\\n    onLoadProgressMessage?: string\\n}\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/ui/{\\n    name?: string,\\n    documentation?: React.ComponentType,\\n    createFields: () => F,\\n    fieldLayout?: (keyof F)[]|(keyof F)[][],\\n    buttons: B,\\n    onLoad?: (fields: F, buttons: B) => Promise<void>,\\n    onLoadProgressMessage?: string\\n}\",\"typeParameters\":[],\"directParents\":null}],\"sourceType\":1}},{\"v\":\"@material-ui/core/styles/WithStyles\"}],\"edges\":[{\"v\":\"@proteinjs/ui/Page\",\"w\":\"@brentbahry/reflection/Loadable\",\"value\":\"extends interface\"},{\"v\":\"@proteinjs/ui/FormProps\",\"w\":\"@material-ui/core/styles/WithStyles\",\"value\":\"extends type\"}]}";


/** Generate Source Links */


const sourceLinks = {
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';