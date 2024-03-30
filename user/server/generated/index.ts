/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import '@proteinjs/db';
import '@proteinjs/server-api';
import '@proteinjs/ui';
import '@proteinjs/user';
import 'crypto-js';
import 'express-session';
import 'moment';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@proteinjs/user-server/userCache\",\"value\":{\"packageName\":\"@proteinjs/user-server\",\"name\":\"userCache\",\"filePath\":\"/Users/brentbahry/repos/components/user/server/src/authorization/userCache.ts\",\"qualifiedName\":\"@proteinjs/user-server/userCache\",\"type\":{\"packageName\":\"\",\"name\":\"SessionDataCache<User>\",\"filePath\":null,\"qualifiedName\":\"/SessionDataCache<User>\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/server-api\",\"name\":\"SessionDataCache\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/SessionDataCache\",\"typeParameters\":[\"@proteinjs/user/User\"],\"directParents\":null}]},\"isExported\":true,\"isConst\":true,\"sourceType\":0}},{\"v\":\"@proteinjs/server-api/SessionDataCache\"},{\"v\":\"@proteinjs/user-server/DbSessionStore\",\"value\":{\"packageName\":\"@proteinjs/user-server\",\"name\":\"DbSessionStore\",\"filePath\":\"/Users/brentbahry/repos/components/user/server/src/authentication/DbSessionStore.ts\",\"qualifiedName\":\"@proteinjs/user-server/DbSessionStore\",\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"properties\":[{\"name\":\"TWELVE_HOURS\",\"type\":null,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":true,\"visibility\":\"private\"},{\"name\":\"get\",\"type\":null,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"set\",\"type\":null,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"touch\",\"type\":null,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"},{\"name\":\"destroy\",\"type\":null,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"}],\"methods\":[{\"name\":\"insertOrUpdate\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<void>\",\"filePath\":null,\"qualifiedName\":\"/Promise<void>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\",\"parameters\":[{\"name\":\"sessionId\",\"type\":{\"packageName\":\"\",\"name\":\"string\",\"filePath\":null,\"qualifiedName\":\"/string\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"session\",\"type\":{\"packageName\":\"\",\"name\":\"Express.SessionData\",\"filePath\":null,\"qualifiedName\":\"/Express.SessionData\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"cb\",\"type\":{\"packageName\":\"\",\"name\":\"(error?: any) => void\",\"filePath\":null,\"qualifiedName\":\"/(error?: any) => void\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"sweep\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<void>\",\"filePath\":null,\"qualifiedName\":\"/Promise<void>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\",\"parameters\":[]}],\"typeParameters\":[],\"directParentInterfaces\":[],\"directParentClasses\":[{\"packageName\":\"express-session\",\"name\":\"Store\",\"filePath\":null,\"qualifiedName\":\"express-session/Store\",\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParentInterfaces\":[],\"directParentClasses\":[]}],\"sourceType\":2}},{\"v\":\"express-session/Store\"},{\"v\":\"@proteinjs/user-server/createUser\",\"value\":{\"packageName\":\"@proteinjs/user-server\",\"name\":\"createUser\",\"filePath\":\"/Users/brentbahry/repos/components/user/server/src/routes/createUser.ts\",\"qualifiedName\":\"@proteinjs/user-server/createUser\",\"type\":{\"packageName\":\"@proteinjs/server-api\",\"name\":\"Route\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/Route\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/server-api\",\"name\":\"Route\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/Route\",\"typeParameters\":[],\"directParents\":null}]},\"isExported\":true,\"isConst\":true,\"sourceType\":0}},{\"v\":\"@proteinjs/server-api/Route\"},{\"v\":\"@proteinjs/user-server/login\",\"value\":{\"packageName\":\"@proteinjs/user-server\",\"name\":\"login\",\"filePath\":\"/Users/brentbahry/repos/components/user/server/src/routes/login.ts\",\"qualifiedName\":\"@proteinjs/user-server/login\",\"type\":{\"packageName\":\"@proteinjs/server-api\",\"name\":\"Route\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/Route\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/server-api\",\"name\":\"Route\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/Route\",\"typeParameters\":[],\"directParents\":null}]},\"isExported\":true,\"isConst\":true,\"sourceType\":0}},{\"v\":\"@proteinjs/user-server/logout\",\"value\":{\"packageName\":\"@proteinjs/user-server\",\"name\":\"logout\",\"filePath\":\"/Users/brentbahry/repos/components/user/server/src/routes/logout.ts\",\"qualifiedName\":\"@proteinjs/user-server/logout\",\"type\":{\"packageName\":\"@proteinjs/server-api\",\"name\":\"Route\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/Route\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/server-api\",\"name\":\"Route\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/server-api/Route\",\"typeParameters\":[],\"directParents\":null}]},\"isExported\":true,\"isConst\":true,\"sourceType\":0}}],\"edges\":[{\"v\":\"@proteinjs/user-server/userCache\",\"w\":\"@proteinjs/server-api/SessionDataCache\",\"value\":\"has type\"},{\"v\":\"@proteinjs/user-server/DbSessionStore\",\"w\":\"express-session/Store\",\"value\":\"extends class\"},{\"v\":\"@proteinjs/user-server/createUser\",\"w\":\"@proteinjs/server-api/Route\",\"value\":\"has type\"},{\"v\":\"@proteinjs/user-server/login\",\"w\":\"@proteinjs/server-api/Route\",\"value\":\"has type\"},{\"v\":\"@proteinjs/user-server/logout\",\"w\":\"@proteinjs/server-api/Route\",\"value\":\"has type\"}]}";


/** Generate Source Links */

import { userCache } from '../src/authorization/userCache';
import { DbSessionStore } from '../src/authentication/DbSessionStore';
import { createUser } from '../src/routes/createUser';
import { login } from '../src/routes/login';
import { logout } from '../src/routes/logout';

const sourceLinks = {
	'@proteinjs/user-server/userCache': userCache,
	'@proteinjs/user-server/DbSessionStore': DbSessionStore,
	'@proteinjs/user-server/createUser': createUser,
	'@proteinjs/user-server/login': login,
	'@proteinjs/user-server/logout': logout,
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';