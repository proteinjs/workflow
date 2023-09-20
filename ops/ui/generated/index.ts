/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import '@proteinjs/ui';
import '@proteinjs/user';
import 'react';
import 'react-dom';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@brentbahry/ops-ui/helloPage\",\"value\":{\"packageName\":\"@brentbahry/ops-ui\",\"name\":\"helloPage\",\"filePath\":\"/Users/brentbahry/Documents/packages/ops/ui/src/Hello.tsx\",\"qualifiedName\":\"@brentbahry/ops-ui/helloPage\",\"type\":{\"packageName\":\"@proteinjs/ui\",\"name\":\"Page\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/ui/Page\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/ui\",\"name\":\"Page\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/ui/Page\",\"typeParameters\":[],\"directParents\":null}]},\"isExported\":true,\"isConst\":true,\"sourceType\":0}},{\"v\":\"@proteinjs/ui/Page\"}],\"edges\":[{\"v\":\"@brentbahry/ops-ui/helloPage\",\"w\":\"@proteinjs/ui/Page\",\"value\":\"has type\"}]}";


/** Generate Source Links */

import { helloPage } from '../src/Hello';

const sourceLinks = {
	'@brentbahry/ops-ui/helloPage': helloPage,
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';