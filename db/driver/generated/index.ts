/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import '@proteinjs/db';
import 'knex';
import 'moment';
import 'mysql';
import 'uuid';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@proteinjs/db-driver/MysqlDBI\",\"value\":{\"packageName\":\"@proteinjs/db-driver\",\"name\":\"MysqlDBI\",\"filePath\":\"/Users/brentbahry/repos/components/db/driver/src/MysqlDBI.ts\",\"qualifiedName\":\"@proteinjs/db-driver/MysqlDBI\",\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"properties\":[{\"name\":\"CONFIG\",\"type\":null,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":true,\"visibility\":\"private\"},{\"name\":\"DB_NAME\",\"type\":null,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":true,\"visibility\":\"private\"},{\"name\":\"knex\",\"type\":{\"packageName\":\"\",\"name\":\"knex\",\"filePath\":null,\"qualifiedName\":\"/knex\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":true,\"visibility\":\"private\"}],\"methods\":[{\"name\":\"init\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<void>\",\"filePath\":null,\"qualifiedName\":\"/Promise<void>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[]},{\"name\":\"get\",\"returnType\":{\"packageName\":\"\",\"name\":\"any\",\"filePath\":null,\"qualifiedName\":\"/any\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":false,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[]},{\"name\":\"databaseName\",\"returnType\":null,\"isAsync\":false,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[]},{\"name\":\"createDatabaseIfNotExists\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<void>\",\"filePath\":null,\"qualifiedName\":\"/Promise<void>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\",\"parameters\":[{\"name\":\"databaseName\",\"type\":{\"packageName\":\"\",\"name\":\"string\",\"filePath\":null,\"qualifiedName\":\"/string\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"databaseExists\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<boolean>\",\"filePath\":null,\"qualifiedName\":\"/Promise<boolean>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\",\"parameters\":[{\"name\":\"databaseName\",\"type\":{\"packageName\":\"\",\"name\":\"string\",\"filePath\":null,\"qualifiedName\":\"/string\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"setMaxAllowedPacketSize\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<void>\",\"filePath\":null,\"qualifiedName\":\"/Promise<void>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\",\"parameters\":[]}],\"typeParameters\":[],\"directParentInterfaces\":[{\"packageName\":\"@proteinjs/db\",\"name\":\"DBIDriver\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db/DBIDriver\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"directParentClasses\":[],\"sourceType\":2}},{\"v\":\"@proteinjs/db/DBIDriver\"}],\"edges\":[{\"v\":\"@proteinjs/db-driver/MysqlDBI\",\"w\":\"@proteinjs/db/DBIDriver\",\"value\":\"implements interface\"}]}";


/** Generate Source Links */

import { MysqlDBI } from '../src/MysqlDBI';

const sourceLinks = {
	'@proteinjs/db-driver/MysqlDBI': MysqlDBI,
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';