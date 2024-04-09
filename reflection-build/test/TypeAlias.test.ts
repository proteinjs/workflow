import './examples/source-repository/a/generated/index';
import { SourceRepository } from '@brentbahry/reflection';

beforeAll(async () => {
	SourceRepository.get();
});

test('can load type alias', async () => {
	const sourceRepository = SourceRepository.get();
	const localLoadableType = sourceRepository.flattenedSourceGraph.typeAliases['@brentbahry/reflection-build-test-a/LocalLoadableType'];
	expect(localLoadableType).toBeTruthy();
	expect(localLoadableType.qualifiedName).toBe('@brentbahry/reflection-build-test-a/LocalLoadableType');
});

test('do not load non-loadable type aliases', async () => {
	const sourceRepository = SourceRepository.get();
	expect(sourceRepository.flattenedSourceGraph.typeAliases['@brentbahry/reflection-build-test-a/LocalNotLoadableType']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.typeAliases['@brentbahry/reflection-build-test-a/ExtendsLocalNotLoadableType']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.typeAliases['@brentbahry/reflection-build-test-b/ENotLoadableForeignType']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.typeAliases['@brentbahry/reflection-build-test-a/ExtendsNotLoadableForeignType']).toBeUndefined();
});

test('type alias can extend local type alias', async () => {
	const sourceRepository = SourceRepository.get();
	const extendsLocalLoadableType = sourceRepository.flattenedSourceGraph.typeAliases['@brentbahry/reflection-build-test-a/ExtendsLocalLoadableType'];
	expect(extendsLocalLoadableType).toBeTruthy();
	expect(extendsLocalLoadableType.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ExtendsLocalLoadableType');
	expect(extendsLocalLoadableType.directParents['@brentbahry/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
	expect(extendsLocalLoadableType.allParents['@brentbahry/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
	expect(extendsLocalLoadableType.rootParents['@brentbahry/reflection-build-test-a/LocalLoadableType']).toBeTruthy();
});

test('type alias can extend foreign type alias', async () => {
	const sourceRepository = SourceRepository.get();
	const extendsLoadableForeignType = sourceRepository.flattenedSourceGraph.typeAliases['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignType'];
	expect(extendsLoadableForeignType).toBeTruthy();
	expect(extendsLoadableForeignType.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ExtendsLoadableForeignType');
	expect(extendsLoadableForeignType.directParents['@brentbahry/reflection-build-test-b/LoadableForeignType']).toBeTruthy();
	expect(extendsLoadableForeignType.allParents['@brentbahry/reflection-build-test-b/LoadableForeignType']).toBeTruthy();
	expect(extendsLoadableForeignType.rootParents['@brentbahry/reflection-build-test-b/LoadableForeignType']).toBeTruthy();
});

test('type alias can be used to find children', async () => {
	const sourceRepository = SourceRepository.get();
	const loadableForeignType = sourceRepository.flattenedSourceGraph.typeAliases['@brentbahry/reflection-build-test-b/LoadableForeignType'];
	expect(loadableForeignType).toBeTruthy();
	expect(loadableForeignType.qualifiedName).toBe('@brentbahry/reflection-build-test-b/LoadableForeignType');
	expect(loadableForeignType.directChildren['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.directChildren['@brentbahry/reflection-build-test-a/implementsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.directChildren['@brentbahry/reflection-build-test-a/implementsExtendsLoadableForeignType']).toBeUndefined();
	expect(loadableForeignType.allChildren['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.allChildren['@brentbahry/reflection-build-test-a/implementsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.allChildren['@brentbahry/reflection-build-test-a/implementsExtendsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.baseChildren['@brentbahry/reflection-build-test-a/implementsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.baseChildren['@brentbahry/reflection-build-test-a/implementsExtendsLoadableForeignType']).toBeTruthy();
	expect(loadableForeignType.baseChildren['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignType']).toBeUndefined();
});