/** Load Dependency Source Graphs */



/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@proteinjs/reflection-build-test-b/LoadableForeignType\",\"value\":{\"packageName\":\"@proteinjs/reflection-build-test-b\",\"name\":\"LoadableForeignType\",\"filePath\":\"/Users/brentbahry/repos/components/reflection-build/test/examples/source-repository/b/src/LoadableForeignType.ts\",\"qualifiedName\":\"@proteinjs/reflection-build-test-b/LoadableForeignType\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/reflection/Loadable\",\"typeParameters\":[],\"directParents\":null},{\"packageName\":\"@proteinjs/reflection-build-test-b\",\"name\":\"{ z: number }\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/reflection-build-test-b/{ z: number }\",\"typeParameters\":[],\"directParents\":null}],\"sourceType\":1}},{\"v\":\"@proteinjs/reflection/Loadable\"},{\"v\":\"@proteinjs/reflection-build-test-b/LoadableForeignInterface\",\"value\":{\"packageName\":\"@proteinjs/reflection-build-test-b\",\"name\":\"LoadableForeignInterface\",\"filePath\":\"/Users/brentbahry/repos/components/reflection-build/test/examples/source-repository/b/src/LoadableForeignType.ts\",\"qualifiedName\":\"@proteinjs/reflection-build-test-b/LoadableForeignInterface\",\"properties\":[{\"name\":\"z\",\"type\":{\"packageName\":\"\",\"name\":\"number\",\"filePath\":null,\"qualifiedName\":\"/number\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"}],\"methods\":[],\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@proteinjs/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/reflection/Loadable\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"sourceType\":3}},{\"v\":\"@proteinjs/reflection-build-test-b/LoadableForeignAbstractClass\",\"value\":{\"packageName\":\"@proteinjs/reflection-build-test-b\",\"name\":\"LoadableForeignAbstractClass\",\"filePath\":\"/Users/brentbahry/repos/components/reflection-build/test/examples/source-repository/b/src/LoadableForeignType.ts\",\"qualifiedName\":\"@proteinjs/reflection-build-test-b/LoadableForeignAbstractClass\",\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"properties\":[{\"name\":\"z\",\"type\":{\"packageName\":\"\",\"name\":\"number\",\"filePath\":null,\"qualifiedName\":\"/number\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"}],\"methods\":[],\"typeParameters\":[],\"directParentInterfaces\":[{\"packageName\":\"@proteinjs/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/reflection/Loadable\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"directParentClasses\":[],\"sourceType\":2}}],\"edges\":[{\"v\":\"@proteinjs/reflection-build-test-b/LoadableForeignType\",\"w\":\"@proteinjs/reflection/Loadable\",\"value\":\"extends type\"},{\"v\":\"@proteinjs/reflection-build-test-b/LoadableForeignInterface\",\"w\":\"@proteinjs/reflection/Loadable\",\"value\":\"extends interface\"},{\"v\":\"@proteinjs/reflection-build-test-b/LoadableForeignAbstractClass\",\"w\":\"@proteinjs/reflection/Loadable\",\"value\":\"implements interface\"}]}";


/** Generate Source Links */

import { LoadableForeignAbstractClass } from '../src/LoadableForeignType';

const sourceLinks = {
	'@proteinjs/reflection-build-test-b/LoadableForeignAbstractClass': LoadableForeignAbstractClass,
};


/** Load Source Graph and Links */

import { SourceRepository } from '@proteinjs/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';