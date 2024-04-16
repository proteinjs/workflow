import '@proteinjs/reflection-build-test-a';
import { SourceRepository } from '@proteinjs/reflection';

beforeAll(async () => {
	SourceRepository.get();
});

test('can load variable', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLocalLoadableType = sourceRepository.flattenedSourceGraph.variables['@proteinjs/reflection-build-test-a/implementsLocalLoadableType'];
	expect(implementsLocalLoadableType).toBeTruthy();
	expect(implementsLocalLoadableType.qualifiedName).toBe('@proteinjs/reflection-build-test-a/implementsLocalLoadableType');
	expect(implementsLocalLoadableType.value).toBeTruthy();
	expect(implementsLocalLoadableType.value.a).toBe('la');
	expect(implementsLocalLoadableType.directParentTypes['@proteinjs/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
	expect(implementsLocalLoadableType.allParentTypes['@proteinjs/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
	expect(implementsLocalLoadableType.allParentTypes['@proteinjs/reflection/Loadable']).toBeTruthy();
	expect(implementsLocalLoadableType.rootParentTypes['@proteinjs/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
});

test('do not load non-loadable variables', async () => {
	const sourceRepository = SourceRepository.get();
	expect(sourceRepository.flattenedSourceGraph.typeAliases['@proteinjs/reflection-build-test-a/implementsLocalNotLoadableType']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.typeAliases['@proteinjs/reflection-build-test-a/implementsExtendsLocalNotLoadableType']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.typeAliases['@proteinjs/reflection-build-test-a/implementsNotLoadableForeignType']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.typeAliases['@proteinjs/reflection-build-test-a/implementsExtendsNotLoadableForeignType']).toBeUndefined();
});

test('variable can extend local type alias', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLocalLoadableType = sourceRepository.flattenedSourceGraph.variables['@proteinjs/reflection-build-test-a/implementsLocalLoadableType'];
	expect(implementsLocalLoadableType).toBeTruthy();
	expect(implementsLocalLoadableType.qualifiedName).toBe('@proteinjs/reflection-build-test-a/implementsLocalLoadableType');
	expect(implementsLocalLoadableType.value.a).toBe('la');
	expect(implementsLocalLoadableType.directParentTypes['@proteinjs/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
	expect(implementsLocalLoadableType.allParentTypes['@proteinjs/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
	expect(implementsLocalLoadableType.allParentTypes['@proteinjs/reflection/Loadable']).toBeTruthy();
	expect(implementsLocalLoadableType.rootParentTypes['@proteinjs/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
});

test('variable can extend 2 local type aliases', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsExtendsLocalLoadableType = sourceRepository.flattenedSourceGraph.variables['@proteinjs/reflection-build-test-a/implementsExtendsLocalLoadableType'];
	expect(implementsExtendsLocalLoadableType).toBeTruthy();
	expect(implementsExtendsLocalLoadableType.qualifiedName).toBe('@proteinjs/reflection-build-test-a/implementsExtendsLocalLoadableType');
	expect(implementsExtendsLocalLoadableType.value.a).toBe('la');
	expect(implementsExtendsLocalLoadableType.value.b).toBe(7);
	expect(implementsExtendsLocalLoadableType.directParentTypes['@proteinjs/reflection-build-test-a/ExtendsLocalLoadableType']).toBeTruthy();
	expect(implementsExtendsLocalLoadableType.allParentTypes['@proteinjs/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
	expect(implementsExtendsLocalLoadableType.allParentTypes['@proteinjs/reflection-build-test-a/ExtendsLocalLoadableType']).toBeTruthy();
	expect(implementsExtendsLocalLoadableType.rootParentTypes['@proteinjs/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
});

test('variable can extend foreign type alias', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLoadableForeignType = sourceRepository.flattenedSourceGraph.variables['@proteinjs/reflection-build-test-a/implementsLoadableForeignType'];
	expect(implementsLoadableForeignType).toBeTruthy();
	expect(implementsLoadableForeignType.qualifiedName).toBe('@proteinjs/reflection-build-test-a/implementsLoadableForeignType');
	expect(implementsLoadableForeignType.value.z).toBe(1);
	expect(implementsLoadableForeignType.directParentTypes['@proteinjs/reflection-build-test-b/LoadableForeignType']).toBeTruthy();
	expect(implementsLoadableForeignType.allParentTypes['@proteinjs/reflection-build-test-b/LoadableForeignType']).toBeTruthy();
	expect(implementsLoadableForeignType.allParentTypes['@proteinjs/reflection/Loadable']).toBeTruthy();
	expect(implementsLoadableForeignType.rootParentTypes['@proteinjs/reflection-build-test-b/LoadableForeignType']).toBeTruthy();
});

test('variable can extend a local type alias and a foreign type alias', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsExtendsLoadableForeignType = sourceRepository.flattenedSourceGraph.variables['@proteinjs/reflection-build-test-a/implementsExtendsLoadableForeignType'];
	expect(implementsExtendsLoadableForeignType).toBeTruthy();
	expect(implementsExtendsLoadableForeignType.qualifiedName).toBe('@proteinjs/reflection-build-test-a/implementsExtendsLoadableForeignType');
	expect(implementsExtendsLoadableForeignType.value.y).toBe('la');
	expect(implementsExtendsLoadableForeignType.value.z).toBe(7);
	expect(implementsExtendsLoadableForeignType.directParentTypes['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignType']).toBeTruthy();
	expect(implementsExtendsLoadableForeignType.allParentTypes['@proteinjs/reflection-build-test-b/LoadableForeignType']).toBeTruthy();
	expect(implementsExtendsLoadableForeignType.allParentTypes['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignType']).toBeTruthy();
	expect(implementsExtendsLoadableForeignType.rootParentTypes['@proteinjs/reflection-build-test-b/LoadableForeignType']).toBeTruthy();
});

test('variable can be used to find parents', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsExtendsLoadableForeignType = sourceRepository.flattenedSourceGraph.variables['@proteinjs/reflection-build-test-a/implementsExtendsLoadableForeignType'];
	expect(implementsExtendsLoadableForeignType).toBeTruthy();
	expect(implementsExtendsLoadableForeignType.qualifiedName).toBe('@proteinjs/reflection-build-test-a/implementsExtendsLoadableForeignType');
	expect(implementsExtendsLoadableForeignType.value).toBeTruthy();
	expect(implementsExtendsLoadableForeignType.value.y).toBe('la');
	expect(implementsExtendsLoadableForeignType.value.z).toBe(7);
	expect(implementsExtendsLoadableForeignType.directParentTypes['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignType']).toBeTruthy();
	expect(implementsExtendsLoadableForeignType.directParentTypes['@proteinjs/reflection-build-test-b/LoadableForeignType']).toBeUndefined();
	expect(implementsExtendsLoadableForeignType.allParentTypes['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignType']).toBeTruthy();
	expect(implementsExtendsLoadableForeignType.allParentTypes['@proteinjs/reflection-build-test-b/LoadableForeignType']).toBeTruthy();
	expect(implementsExtendsLoadableForeignType.allParentTypes['@proteinjs/reflection/Loadable']).toBeTruthy();
	expect(implementsExtendsLoadableForeignType.rootParentTypes['@proteinjs/reflection-build-test-b/LoadableForeignType']).toBeTruthy();
});

test('can load variable type parameters', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLocalLoadableTypeWithArgs = sourceRepository.flattenedSourceGraph.variables['@proteinjs/reflection-build-test-a/implementsLocalLoadableTypeWithArgs'];
	expect(implementsLocalLoadableTypeWithArgs).toBeTruthy();
	expect(implementsLocalLoadableTypeWithArgs.qualifiedName).toBe('@proteinjs/reflection-build-test-a/implementsLocalLoadableTypeWithArgs');
	expect(implementsLocalLoadableTypeWithArgs.value.a).toBe(1);
	const localLoadableTypeWithArgs = implementsLocalLoadableTypeWithArgs.directParentTypes['@proteinjs/reflection-build-test-a/LocalLoadableTypeWithArgs'];
	expect(localLoadableTypeWithArgs).toBeTruthy();
	expect(localLoadableTypeWithArgs.qualifiedName).toBe('@proteinjs/reflection-build-test-a/LocalLoadableTypeWithArgs');
	expect(implementsLocalLoadableTypeWithArgs.typeParameters['@proteinjs/reflection-build-test-a/LocalLoadableTypeWithArgs']).toBeTruthy();
	expect(implementsLocalLoadableTypeWithArgs.typeParameters['@proteinjs/reflection-build-test-a/LocalLoadableTypeWithArgs'][0].qualifiedName).toBe('@proteinjs/reflection-build-test-a/LocalLoadableType');
});