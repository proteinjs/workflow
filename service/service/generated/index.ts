/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import '@brentbahry/util';
import '@proteinjs/serializer';
import '@proteinjs/server-api';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@proteinjs/service/Service\",\"value\":{\"packageName\":\"@proteinjs/service\",\"name\":\"Service\",\"filePath\":\"/Users/brentbahry/repos/components/service/service/src/Service.ts\",\"qualifiedName\":\"@proteinjs/service/Service\",\"properties\":[{\"name\":\"public\",\"type\":{\"packageName\":\"\",\"name\":\"boolean\",\"filePath\":null,\"qualifiedName\":\"/boolean\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"roles\",\"type\":{\"packageName\":\"\",\"name\":\"string[]\",\"filePath\":null,\"qualifiedName\":\"/string[]\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"}],\"methods\":[],\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@brentbahry/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@brentbahry/reflection/Loadable\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"sourceType\":3}},{\"v\":\"@brentbahry/reflection/Loadable\"},{\"v\":\"@proteinjs/service/ServiceRouter\",\"value\":{\"packageName\":\"@proteinjs/service\",\"name\":\"ServiceRouter\",\"filePath\":\"/Users/brentbahry/repos/components/service/service/src/ServiceRouter.ts\",\"qualifiedName\":\"@proteinjs/service/ServiceRouter\",\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"properties\":[{\"name\":\"logger\",\"type\":null,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\"},{\"name\":\"serviceExecutorMap\",\"type\":{\"packageName\":\"@proteinjs/service\",\"name\":\"{[path: string]: ServiceExecutor}|undefined\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/service/{[path: string]: ServiceExecutor}|undefined\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\"},{\"name\":\"path\",\"type\":null,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"method\",\"type\":{\"packageName\":\"\",\"name\":\"'post'\",\"filePath\":null,\"qualifiedName\":\"/'post'\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"}],\"methods\":[{\"name\":\"getServiceExecutorMap\",\"returnType\":null,\"isAsync\":false,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\",\"parameters\":[]},{\"name\":\"onRequest\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<any>\",\"filePath\":null,\"qualifiedName\":\"/Promise<any>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[{\"name\":\"request\",\"type\":{\"packageName\":\"\",\"name\":\"any\",\"filePath\":null,\"qualifiedName\":\"/any\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"response\",\"type\":{\"packageName\":\"\",\"name\":\"any\",\"filePath\":null,\"qualifiedName\":\"/any\",\"typeParameters\":null,\"directParents\":null}}]}],\"typeParameters\":[],\"directParentInterfaces\":[{\"packageName\":\"@proteinjs/server-api\",\"name\":\"Route\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/Route\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"directParentClasses\":[],\"sourceType\":2}},{\"v\":\"@proteinjs/server-api/Route\"}],\"edges\":[{\"v\":\"@proteinjs/service/Service\",\"w\":\"@brentbahry/reflection/Loadable\",\"value\":\"extends interface\"},{\"v\":\"@proteinjs/service/ServiceRouter\",\"w\":\"@proteinjs/server-api/Route\",\"value\":\"implements interface\"}]}";


/** Generate Source Links */

import { ServiceRouter } from '../src/ServiceRouter';

const sourceLinks = {
	'@proteinjs/service/ServiceRouter': ServiceRouter,
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';