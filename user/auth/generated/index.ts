/** Load Dependency Source Graphs */

import '@proteinjs/reflection';
import 'moment';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@proteinjs/user-auth/AuthenticatedUserRepo\",\"value\":{\"packageName\":\"@proteinjs/user-auth\",\"name\":\"AuthenticatedUserRepo\",\"filePath\":\"/Users/brentbahry/repos/components/user/auth/src/UserAuth.ts\",\"qualifiedName\":\"@proteinjs/user-auth/AuthenticatedUserRepo\",\"properties\":[],\"methods\":[{\"name\":\"getUser\",\"returnType\":{\"packageName\":\"@proteinjs/user-auth\",\"name\":\"AuthenticatedUser\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/user-auth/AuthenticatedUser\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":false,\"isOptional\":false,\"isAbstract\":true,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[]}],\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/reflection/Loadable\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"sourceType\":3}},{\"v\":\"@proteinjs/reflection/Loadable\"}],\"edges\":[{\"v\":\"@proteinjs/user-auth/AuthenticatedUserRepo\",\"w\":\"@proteinjs/reflection/Loadable\",\"value\":\"extends interface\"}]}";


/** Generate Source Links */


const sourceLinks = {
};


/** Load Source Graph and Links */

import { SourceRepository } from '@proteinjs/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';