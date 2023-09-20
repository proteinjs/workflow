/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import '@proteinjs/db';
import '@proteinjs/server';
import '@proteinjs/server-api';
import '@proteinjs/user';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@brentbahry/ops-server/helloWorld\",\"value\":{\"packageName\":\"@brentbahry/ops-server\",\"name\":\"helloWorld\",\"filePath\":\"/Users/brentbahry/Documents/packages/ops/server/src/helloWorld.ts\",\"qualifiedName\":\"@brentbahry/ops-server/helloWorld\",\"type\":{\"packageName\":\"@proteinjs/server-api\",\"name\":\"Route\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/Route\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/server-api\",\"name\":\"Route\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/Route\",\"typeParameters\":[],\"directParents\":null}]},\"isExported\":true,\"isConst\":true,\"sourceType\":0}},{\"v\":\"@proteinjs/server-api/Route\"},{\"v\":\"@brentbahry/ops-server/serverConfig\",\"value\":{\"packageName\":\"@brentbahry/ops-server\",\"name\":\"serverConfig\",\"filePath\":\"/Users/brentbahry/Documents/packages/ops/server/src/serverConfig.ts\",\"qualifiedName\":\"@brentbahry/ops-server/serverConfig\",\"type\":{\"packageName\":\"@proteinjs/server-api\",\"name\":\"ServerConfig\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/ServerConfig\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/server-api\",\"name\":\"ServerConfig\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/ServerConfig\",\"typeParameters\":[],\"directParents\":null}]},\"isExported\":true,\"isConst\":true,\"sourceType\":0}},{\"v\":\"@proteinjs/server-api/ServerConfig\"}],\"edges\":[{\"v\":\"@brentbahry/ops-server/helloWorld\",\"w\":\"@proteinjs/server-api/Route\",\"value\":\"has type\"},{\"v\":\"@brentbahry/ops-server/serverConfig\",\"w\":\"@proteinjs/server-api/ServerConfig\",\"value\":\"has type\"}]}";


/** Generate Source Links */

import { helloWorld } from '../src/helloWorld';
import { serverConfig } from '../src/serverConfig';

const sourceLinks = {
	'@brentbahry/ops-server/helloWorld': helloWorld,
	'@brentbahry/ops-server/serverConfig': serverConfig,
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';