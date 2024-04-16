/** Load Dependency Source Graphs */

import '@proteinjs/reflection';
import '@proteinjs/server-api';
import '@proteinjs/ui';
import '@proteinjs/user';
import 'moment';
import 'react';
import 'react-dom';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"/Omit\"},{\"v\":\"@proteinjs/user-ui/loginPage\",\"value\":{\"packageName\":\"@proteinjs/user-ui\",\"name\":\"loginPage\",\"filePath\":\"/Users/brentbahry/repos/components/user/ui/src/pages/Login.tsx\",\"qualifiedName\":\"@proteinjs/user-ui/loginPage\",\"type\":{\"packageName\":\"@proteinjs/ui\",\"name\":\"Page\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/ui/Page\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/ui\",\"name\":\"Page\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/ui/Page\",\"typeParameters\":[],\"directParents\":null}]},\"isExported\":true,\"isConst\":true,\"sourceType\":0}},{\"v\":\"@proteinjs/ui/Page\"},{\"v\":\"@proteinjs/user-ui/signupPage\",\"value\":{\"packageName\":\"@proteinjs/user-ui\",\"name\":\"signupPage\",\"filePath\":\"/Users/brentbahry/repos/components/user/ui/src/pages/Signup.tsx\",\"qualifiedName\":\"@proteinjs/user-ui/signupPage\",\"type\":{\"packageName\":\"@proteinjs/ui\",\"name\":\"Page\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/ui/Page\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/ui\",\"name\":\"Page\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/ui/Page\",\"typeParameters\":[],\"directParents\":null}]},\"isExported\":true,\"isConst\":true,\"sourceType\":0}}],\"edges\":[{\"v\":\"@proteinjs/user-ui/loginPage\",\"w\":\"@proteinjs/ui/Page\",\"value\":\"has type\"},{\"v\":\"@proteinjs/user-ui/signupPage\",\"w\":\"@proteinjs/ui/Page\",\"value\":\"has type\"}]}";


/** Generate Source Links */

import { loginPage } from '../src/pages/Login';
import { signupPage } from '../src/pages/Signup';

const sourceLinks = {
	'@proteinjs/user-ui/loginPage': loginPage,
	'@proteinjs/user-ui/signupPage': signupPage,
};


/** Load Source Graph and Links */

import { SourceRepository } from '@proteinjs/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';