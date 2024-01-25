/** Load Dependency Source Graphs */



/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@brentbahry/reflection-build-test-b/LoadableForeignType\",\"value\":{\"packageName\":\"@brentbahry/reflection-build-test-b\",\"name\":\"LoadableForeignType\",\"filePath\":\"/Users/brentbahry/repos/components/reflection-build/test/examples/source-repository/b/src/LoadableForeignType.ts\",\"qualifiedName\":\"@brentbahry/reflection-build-test-b/LoadableForeignType\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@brentbahry/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@brentbahry/reflection/Loadable\",\"typeParameters\":[],\"directParents\":null},{\"packageName\":\"@brentbahry/reflection-build-test-b\",\"name\":\"{ z: number }\",\"filePath\":null,\"qualifiedName\":\"@brentbahry/reflection-build-test-b/{ z: number }\",\"typeParameters\":[],\"directParents\":null}],\"sourceType\":1}},{\"v\":\"@brentbahry/reflection/Loadable\"},{\"v\":\"@brentbahry/reflection-build-test-b/LoadableForeignInterface\",\"value\":{\"packageName\":\"@brentbahry/reflection-build-test-b\",\"name\":\"LoadableForeignInterface\",\"filePath\":\"/Users/brentbahry/repos/components/reflection-build/test/examples/source-repository/b/src/LoadableForeignType.ts\",\"qualifiedName\":\"@brentbahry/reflection-build-test-b/LoadableForeignInterface\",\"properties\":[{\"name\":\"z\",\"type\":{\"packageName\":\"\",\"name\":\"number\",\"filePath\":null,\"qualifiedName\":\"/number\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"}],\"methods\":[],\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@brentbahry/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@brentbahry/reflection/Loadable\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"sourceType\":3}},{\"v\":\"@brentbahry/reflection-build-test-b/LoadableForeignAbstractClass\",\"value\":{\"packageName\":\"@brentbahry/reflection-build-test-b\",\"name\":\"LoadableForeignAbstractClass\",\"filePath\":\"/Users/brentbahry/repos/components/reflection-build/test/examples/source-repository/b/src/LoadableForeignType.ts\",\"qualifiedName\":\"@brentbahry/reflection-build-test-b/LoadableForeignAbstractClass\",\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"properties\":[{\"name\":\"z\",\"type\":{\"packageName\":\"\",\"name\":\"number\",\"filePath\":null,\"qualifiedName\":\"/number\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\"}],\"methods\":[],\"typeParameters\":[],\"directParentInterfaces\":[{\"packageName\":\"@brentbahry/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@brentbahry/reflection/Loadable\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"directParentClasses\":[],\"sourceType\":2}}],\"edges\":[{\"v\":\"@brentbahry/reflection-build-test-b/LoadableForeignType\",\"w\":\"@brentbahry/reflection/Loadable\",\"value\":\"extends type\"},{\"v\":\"@brentbahry/reflection-build-test-b/LoadableForeignInterface\",\"w\":\"@brentbahry/reflection/Loadable\",\"value\":\"extends interface\"},{\"v\":\"@brentbahry/reflection-build-test-b/LoadableForeignAbstractClass\",\"w\":\"@brentbahry/reflection/Loadable\",\"value\":\"implements interface\"}]}";


/** Generate Source Links */

import { LoadableForeignAbstractClass } from '../src/LoadableForeignType';

const sourceLinks = {
	'@brentbahry/reflection-build-test-b/LoadableForeignAbstractClass': LoadableForeignAbstractClass,
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';