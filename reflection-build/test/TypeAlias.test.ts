import '@proteinjs/reflection-build-test-a';
import { SourceRepository } from '@proteinjs/reflection';

beforeAll(async () => {
	SourceRepository.get();
});

test('can load type alias', async () => {
	const sourceRepository = SourceRepository.get();
	const localLoadableType = sourceRepository.flattenedSourceGraph.typeAliases['@proteinjs/reflection-build-test-a/LocalLoadableType'];
	expect(localLoadableType).toBeTruthy();
	expect(localLoadableType.qualifiedName).toBe('@proteinjs/reflection-build-test-a/LocalLoadableType');
});

test('do not load non-loadable type aliases', async () => {
	const sourceRepository = SourceRepository.get();
	expect(sourceRepository.flattenedSourceGraph.typeAliases['@proteinjs/reflection-build-test-a/LocalNotLoadableType']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.typeAliases['@proteinjs/reflection-build-test-a/ExtendsLocalNotLoadableType']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.typeAliases['@proteinjs/reflection-build-test-b/ENotLoadableForeignType']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.typeAliases['@proteinjs/reflection-build-test-a/ExtendsNotLoadableForeignType']).toBeUndefined();
});

test('type alias can extend local type alias', async () => {
	const sourceRepository = SourceRepository.get();
	const extendsLocalLoadableType = sourceRepository.flattenedSourceGraph.typeAliases['@proteinjs/reflection-build-test-a/ExtendsLocalLoadableType'];
	expect(extendsLocalLoadableType).toBeTruthy();
	expect(extendsLocalLoadableType.qualifiedName).toBe('@proteinjs/reflection-build-test-a/ExtendsLocalLoadableType');
	expect(extendsLocalLoadableType.directParents['@proteinjs/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
	expect(extendsLocalLoadableType.allParents['@proteinjs/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
	expect(extendsLocalLoadableType.rootParents['@proteinjs/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
});

test('type alias can extend foreign type alias', async () => {
	const sourceRepository = SourceRepository.get();
	const extendsLoadableForeignType = sourceRepository.flattenedSourceGraph.typeAliases['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignType'];
	expect(extendsLoadableForeignType).toBeTruthy();
	expect(extendsLoadableForeignType.qualifiedName).toBe('@proteinjs/reflection-build-test-a/ExtendsLoadableForeignType');
	expect(extendsLoadableForeignType.directParents['@proteinjs/reflection-build-test-b/LoadableForeignType']).toBeTruthy();
	expect(extendsLoadableForeignType.allParents['@proteinjs/reflection-build-test-b/LoadableForeignType']).toBeTruthy();
	expect(extendsLoadableForeignType.rootParents['@proteinjs/reflection-build-test-b/LoadableForeignType']).toBeTruthy();
});

test('type alias can be used to find children', async () => {
	const sourceRepository = SourceRepository.get();
	const loadableForeignType = sourceRepository.flattenedSourceGraph.typeAliases['@proteinjs/reflection-build-test-b/LoadableForeignType'];
	expect(loadableForeignType).toBeTruthy();
	expect(loadableForeignType.qualifiedName).toBe('@proteinjs/reflection-build-test-b/LoadableForeignType');
	expect(loadableForeignType.directChildren['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.directChildren['@proteinjs/reflection-build-test-a/implementsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.directChildren['@proteinjs/reflection-build-test-a/implementsExtendsLoadableForeignType']).toBeUndefined();
	expect(loadableForeignType.allChildren['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.allChildren['@proteinjs/reflection-build-test-a/implementsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.allChildren['@proteinjs/reflection-build-test-a/implementsExtendsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.baseChildren['@proteinjs/reflection-build-test-a/implementsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.baseChildren['@proteinjs/reflection-build-test-a/implementsExtendsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.baseChildren['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignType']).toBeUndefined();
});