/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import 'moment';
import 'uuid';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@proteinjs/db/DBIDriver\",\"value\":{\"packageName\":\"@proteinjs/db\",\"name\":\"DBIDriver\",\"filePath\":\"/Users/brentbahry/Documents/packages/db/db/src/DBI.ts\",\"qualifiedName\":\"@proteinjs/db/DBIDriver\",\"properties\":[],\"methods\":[{\"name\":\"init\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<void>\",\"filePath\":null,\"qualifiedName\":\"/Promise<void>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":false,\"isOptional\":false,\"isAbstract\":true,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[]},{\"name\":\"get\",\"returnType\":{\"packageName\":\"\",\"name\":\"knex\",\"filePath\":null,\"qualifiedName\":\"/knex\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":false,\"isOptional\":false,\"isAbstract\":true,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[]},{\"name\":\"databaseName\",\"returnType\":{\"packageName\":\"\",\"name\":\"string\",\"filePath\":null,\"qualifiedName\":\"/string\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":false,\"isOptional\":false,\"isAbstract\":true,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[]}],\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@brentbahry/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@brentbahry/reflection/Loadable\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"sourceType\":3}},{\"v\":\"@brentbahry/reflection/Loadable\"},{\"v\":\"@proteinjs/db/Table\",\"value\":{\"packageName\":\"@proteinjs/db\",\"name\":\"Table\",\"filePath\":\"/Users/brentbahry/Documents/packages/db/db/src/Table.ts\",\"qualifiedName\":\"@proteinjs/db/Table\",\"typeParameters\":[\"/T\"],\"directParents\":[{\"packageName\":\"@brentbahry/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@brentbahry/reflection/Loadable\",\"typeParameters\":[],\"directParents\":null},{\"packageName\":\"@proteinjs/db\",\"name\":\"{\\n\\tname: string,\\n\\tcolumns: { [P in keyof T]: Column<T[P], T> },\\n\\tprimaryKey?: (keyof T)[],\\n\\tindexes?: { columns: (keyof T)[], name?: string }[]\\n}\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db/{\\n\\tname: string,\\n\\tcolumns: { [P in keyof T]: Column<T[P], T> },\\n\\tprimaryKey?: (keyof T)[],\\n\\tindexes?: { columns: (keyof T)[], name?: string }[]\\n}\",\"typeParameters\":[],\"directParents\":null}],\"sourceType\":1}},{\"v\":\"/'integer'\\n\\t| 'bigInteger'\\n\\t| 'text'\\n\\t| 'mediumtext'\\n\\t| 'longtext'\\n\\t| 'string'\\n\\t| 'float'\\n\\t| 'decimal'\\n\\t| 'boolean'\\n\\t| 'date'\\n\\t| 'dateTime'\\n\\t| 'binary'\\n\\t| 'uuid'\"}],\"edges\":[{\"v\":\"@proteinjs/db/DBIDriver\",\"w\":\"@brentbahry/reflection/Loadable\",\"value\":\"extends interface\"},{\"v\":\"@proteinjs/db/Table\",\"w\":\"@brentbahry/reflection/Loadable\",\"value\":\"extends type\"}]}";


/** Generate Source Links */


const sourceLinks = {
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';