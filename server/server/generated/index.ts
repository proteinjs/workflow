/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import '@brentbahry/util';
import '@proteinjs/db';
import '@proteinjs/server-api';
import 'body-parser';
import 'compression';
import 'cookie-parser';
import 'express';
import 'express-session';
import 'passport';
import 'passport-local';
import 'react';
import 'react-helmet';
import 'webpack';
import 'webpack-dev-middleware';
import 'webpack-hot-middleware';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@proteinjs/server/NodeSessionDataStorage\",\"value\":{\"packageName\":\"@proteinjs/server\",\"name\":\"NodeSessionDataStorage\",\"filePath\":\"/Users/brentbahry/repos/components/server/server/src/NodeSessionDataStorage.ts\",\"qualifiedName\":\"@proteinjs/server/NodeSessionDataStorage\",\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"properties\":[{\"name\":\"HOOK_INITIALIZED\",\"type\":null,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":true,\"visibility\":\"private\"},{\"name\":\"SESSION_DATA\",\"type\":{\"packageName\":\"@proteinjs/server\",\"name\":\"{[id: string]: SessionData}\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server/{[id: string]: SessionData}\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":true,\"visibility\":\"private\"},{\"name\":\"environment\",\"type\":null,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"}],\"methods\":[{\"name\":\"setData\",\"returnType\":null,\"isAsync\":false,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[{\"name\":\"data\",\"type\":{\"packageName\":\"@proteinjs/server-api\",\"name\":\"SessionData\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/SessionData\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"getData\",\"returnType\":{\"packageName\":\"@proteinjs/server-api\",\"name\":\"SessionData\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/SessionData\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":false,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[]},{\"name\":\"initHook\",\"returnType\":null,\"isAsync\":false,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\",\"parameters\":[]}],\"typeParameters\":[],\"directParentInterfaces\":[{\"packageName\":\"@proteinjs/server-api\",\"name\":\"SessionDataStorage\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/SessionDataStorage\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"directParentClasses\":[],\"sourceType\":2}},{\"v\":\"@proteinjs/server-api/SessionDataStorage\"},{\"v\":\"@proteinjs/server/healthCheck\",\"value\":{\"packageName\":\"@proteinjs/server\",\"name\":\"healthCheck\",\"filePath\":\"/Users/brentbahry/repos/components/server/server/src/routes/healthCheck.ts\",\"qualifiedName\":\"@proteinjs/server/healthCheck\",\"type\":{\"packageName\":\"@proteinjs/server-api\",\"name\":\"Route\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/Route\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/server-api\",\"name\":\"Route\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/Route\",\"typeParameters\":[],\"directParents\":null}]},\"isExported\":true,\"isConst\":true,\"sourceType\":0}},{\"v\":\"@proteinjs/server-api/Route\"}],\"edges\":[{\"v\":\"@proteinjs/server/NodeSessionDataStorage\",\"w\":\"@proteinjs/server-api/SessionDataStorage\",\"value\":\"implements interface\"},{\"v\":\"@proteinjs/server/healthCheck\",\"w\":\"@proteinjs/server-api/Route\",\"value\":\"has type\"}]}";


/** Generate Source Links */

import { NodeSessionDataStorage } from '../src/NodeSessionDataStorage';
import { healthCheck } from '../src/routes/healthCheck';

const sourceLinks = {
	'@proteinjs/server/NodeSessionDataStorage': NodeSessionDataStorage,
	'@proteinjs/server/healthCheck': healthCheck,
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';