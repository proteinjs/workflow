/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import '@mui/icons-material';
import '@mui/material';
import '@proteinjs/db';
import '@proteinjs/ui';
import 'react';
import 'string';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@proteinjs/db-ui/QueryTableLoader\",\"value\":{\"packageName\":\"@proteinjs/db-ui\",\"name\":\"QueryTableLoader\",\"filePath\":\"/Users/brentbahry/repos/components/db/ui/src/table/QueryTableLoader.ts\",\"qualifiedName\":\"@proteinjs/db-ui/QueryTableLoader\",\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"properties\":[{\"name\":\"table\",\"type\":{\"packageName\":\"\",\"name\":\"Table<T>\",\"filePath\":null,\"qualifiedName\":\"/Table<T>\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\"},{\"name\":\"query\",\"type\":{\"packageName\":\"\",\"name\":\"Query<T>\",\"filePath\":null,\"qualifiedName\":\"/Query<T>\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\"},{\"name\":\"sort\",\"type\":{\"packageName\":\"@proteinjs/db-ui\",\"name\":\"{ column: keyof T, desc?: boolean }[]\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db-ui/{ column: keyof T, desc?: boolean }[]\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":true,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\"}],\"methods\":[{\"name\":\"load\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<RowWindow<T>>\",\"filePath\":null,\"qualifiedName\":\"/Promise<RowWindow<T>>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[{\"name\":\"startIndex\",\"type\":{\"packageName\":\"\",\"name\":\"number\",\"filePath\":null,\"qualifiedName\":\"/number\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"endIndex\",\"type\":{\"packageName\":\"\",\"name\":\"number\",\"filePath\":null,\"qualifiedName\":\"/number\",\"typeParameters\":null,\"directParents\":null}}]}],\"typeParameters\":[\"/T extends Record\"],\"directParentInterfaces\":[{\"packageName\":\"@proteinjs/ui\",\"name\":\"TableLoader\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/ui/TableLoader\",\"properties\":[],\"methods\":[],\"typeParameters\":[\"/T\"],\"directParents\":[]}],\"directParentClasses\":[],\"sourceType\":2}},{\"v\":\"@proteinjs/ui/TableLoader\"},{\"v\":\"@proteinjs/db-ui/rootThoughtsPage\",\"value\":{\"packageName\":\"@proteinjs/db-ui\",\"name\":\"rootThoughtsPage\",\"filePath\":\"/Users/brentbahry/repos/components/db/ui/src/pages/RecordTablePage.tsx\",\"qualifiedName\":\"@proteinjs/db-ui/rootThoughtsPage\",\"type\":{\"packageName\":\"@proteinjs/ui\",\"name\":\"Page\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/ui/Page\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/ui\",\"name\":\"Page\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/ui/Page\",\"typeParameters\":[],\"directParents\":null}]},\"isExported\":true,\"isConst\":true,\"sourceType\":0}},{\"v\":\"@proteinjs/ui/Page\"}],\"edges\":[{\"v\":\"@proteinjs/db-ui/QueryTableLoader\",\"w\":\"@proteinjs/ui/TableLoader\",\"value\":\"implements interface\"},{\"v\":\"@proteinjs/db-ui/rootThoughtsPage\",\"w\":\"@proteinjs/ui/Page\",\"value\":\"has type\"}]}";


/** Generate Source Links */

import { QueryTableLoader } from '../src/table/QueryTableLoader';
import { rootThoughtsPage } from '../src/pages/RecordTablePage';

const sourceLinks = {
	'@proteinjs/db-ui/QueryTableLoader': QueryTableLoader,
	'@proteinjs/db-ui/rootThoughtsPage': rootThoughtsPage,
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';