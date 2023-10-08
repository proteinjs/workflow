/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import 'moment';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"/string | boolean | number | Serializable[] | SerializableObject | CustomSerializableObject\"},{\"v\":\"@proteinjs/serializer/CustomSerializer\",\"value\":{\"packageName\":\"@proteinjs/serializer\",\"name\":\"CustomSerializer\",\"filePath\":\"/Users/brentbahry/repos/components/serializer/src/Serializer.ts\",\"qualifiedName\":\"@proteinjs/serializer/CustomSerializer\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@brentbahry/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@brentbahry/reflection/Loadable\",\"typeParameters\":[],\"directParents\":null},{\"packageName\":\"@proteinjs/serializer\",\"name\":\"CustomSerializerBase\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/serializer/CustomSerializerBase\",\"typeParameters\":[],\"directParents\":null},{\"packageName\":\"@proteinjs/serializer\",\"name\":\"{\\n  id: string,\\n}\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/serializer/{\\n  id: string,\\n}\",\"typeParameters\":[],\"directParents\":null}],\"sourceType\":1}},{\"v\":\"@brentbahry/reflection/Loadable\"},{\"v\":\"@proteinjs/serializer/CustomSerializerBase\"},{\"v\":\"@proteinjs/serializer/ThirdPartyLibCustomSerializer\",\"value\":{\"packageName\":\"@proteinjs/serializer\",\"name\":\"ThirdPartyLibCustomSerializer\",\"filePath\":\"/Users/brentbahry/repos/components/serializer/src/Serializer.ts\",\"qualifiedName\":\"@proteinjs/serializer/ThirdPartyLibCustomSerializer\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@brentbahry/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@brentbahry/reflection/Loadable\",\"typeParameters\":[],\"directParents\":null},{\"packageName\":\"@proteinjs/serializer\",\"name\":\"CustomSerializerBase\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/serializer/CustomSerializerBase\",\"typeParameters\":[],\"directParents\":null},{\"packageName\":\"@proteinjs/serializer\",\"name\":\"{\\n  matches: (obj: any) => boolean,\\n}\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/serializer/{\\n  matches: (obj: any) => boolean,\\n}\",\"typeParameters\":[],\"directParents\":null}],\"sourceType\":1}}],\"edges\":[{\"v\":\"@proteinjs/serializer/CustomSerializer\",\"w\":\"@brentbahry/reflection/Loadable\",\"value\":\"extends type\"},{\"v\":\"@proteinjs/serializer/CustomSerializer\",\"w\":\"@proteinjs/serializer/CustomSerializerBase\",\"value\":\"extends type\"},{\"v\":\"@proteinjs/serializer/ThirdPartyLibCustomSerializer\",\"w\":\"@brentbahry/reflection/Loadable\",\"value\":\"extends type\"},{\"v\":\"@proteinjs/serializer/ThirdPartyLibCustomSerializer\",\"w\":\"@proteinjs/serializer/CustomSerializerBase\",\"value\":\"extends type\"}]}";


/** Generate Source Links */


const sourceLinks = {
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';