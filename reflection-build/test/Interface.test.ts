import '@brentbahry/reflection-build-test-a';
import { SourceRepository } from '@brentbahry/reflection';

beforeAll(async () => {
	SourceRepository.get();
});

test('can load interface', async () => {
	const sourceRepository = SourceRepository.get();
	const localLoadableInterface = sourceRepository.flattenedSourceGraph.interfaces['@brentbahry/reflection-build-test-a/LocalLoadableInterface'];
	expect(localLoadableInterface).toBeTruthy();
	expect(localLoadableInterface.qualifiedName).toBe('@brentbahry/reflection-build-test-a/LocalLoadableInterface');
});

test('do not load non-loadable interfaces', async () => {
	const sourceRepository = SourceRepository.get();
	expect(sourceRepository.flattenedSourceGraph.interfaces['@brentbahry/reflection-build-test-a/LocalNotLoadableInterface']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.interfaces['@brentbahry/reflection-build-test-a/ExtendsLocalNotLoadableInterface']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.interfaces['@brentbahry/reflection-build-test-b/NotLoadableForeignInterface']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.interfaces['@brentbahry/reflection-build-test-a/ExtendsNotLoadableForeignInterface']).toBeUndefined();
});

test('interface can extend local interface', async () => {
	const sourceRepository = SourceRepository.get();
	const extendsLocalLoadableInterface = sourceRepository.flattenedSourceGraph.interfaces['@brentbahry/reflection-build-test-a/ExtendsLocalLoadableInterface'];
	expect(extendsLocalLoadableInterface).toBeTruthy();
	expect(extendsLocalLoadableInterface.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ExtendsLocalLoadableInterface');
	expect(extendsLocalLoadableInterface.directParents['@brentbahry/reflection-build-test-a/LocalLoadableInterface']).toBeTruthy();
	expect(extendsLocalLoadableInterface.allParents['@brentbahry/reflection-build-test-a/LocalLoadableInterface']).toBeTruthy();
	expect(extendsLocalLoadableInterface.rootParents['@brentbahry/reflection-build-test-a/LocalLoadableInterface']).toBeTruthy();
});

test('interface can extend foreign interface', async () => {
	const sourceRepository = SourceRepository.get();
	const extendsLoadableForeignInterface = sourceRepository.flattenedSourceGraph.interfaces['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignInterface'];
	expect(extendsLoadableForeignInterface).toBeTruthy();
	expect(extendsLoadableForeignInterface.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ExtendsLoadableForeignInterface');
	expect(extendsLoadableForeignInterface.directParents['@brentbahry/reflection-build-test-b/LoadableForeignInterface']).toBeTruthy();
	expect(extendsLoadableForeignInterface.allParents['@brentbahry/reflection-build-test-b/LoadableForeignInterface']).toBeTruthy();
	expect(extendsLoadableForeignInterface.rootParents['@brentbahry/reflection-build-test-b/LoadableForeignInterface']).toBeTruthy();
});

test('interface can be used to find children', async () => {
	const sourceRepository = SourceRepository.get();
	const loadableForeignInterface = sourceRepository.flattenedSourceGraph.interfaces['@brentbahry/reflection-build-test-b/LoadableForeignInterface'];
	expect(loadableForeignInterface).toBeTruthy();
	expect(loadableForeignInterface.qualifiedName).toBe('@brentbahry/reflection-build-test-b/LoadableForeignInterface');
	expect(loadableForeignInterface.directChildren['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignInterface']).toBeTruthy();
	expect(loadableForeignInterface.directChildren['@brentbahry/reflection-build-test-a/ImplementsLoadableForeignInterface']).toBeTruthy();
	expect(loadableForeignInterface.directChildren['@brentbahry/reflection-build-test-a/ImplementsExtendsLoadableForeignInterface']).toBeUndefined();
	expect(loadableForeignInterface.allChildren['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignInterface']).toBeTruthy();
	expect(loadableForeignInterface.allChildren['@brentbahry/reflection-build-test-a/ImplementsLoadableForeignInterface']).toBeTruthy();
	expect(loadableForeignInterface.allChildren['@brentbahry/reflection-build-test-a/ImplementsExtendsLoadableForeignInterface']).toBeTruthy();
	expect(loadableForeignInterface.baseChildren['@brentbahry/reflection-build-test-a/ImplementsLoadableForeignInterface']).toBeTruthy();
	expect(loadableForeignInterface.baseChildren['@brentbahry/reflection-build-test-a/ImplementsExtendsLoadableForeignInterface']).toBeTruthy();
	expect(loadableForeignInterface.baseChildren['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignInterface']).toBeUndefined();
});

test('can load interface type parameters from parent', async () => {
	const sourceRepository = SourceRepository.get();
	const extendsLocalLoadableInterfaceWithArgs = sourceRepository.flattenedSourceGraph.interfaces['@brentbahry/reflection-build-test-a/ExtendsLocalLoadableInterfaceWithArgs'];
	expect(extendsLocalLoadableInterfaceWithArgs).toBeTruthy();
	expect(extendsLocalLoadableInterfaceWithArgs.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ExtendsLocalLoadableInterfaceWithArgs');
	const localLoadableInterfaceWithArgs = extendsLocalLoadableInterfaceWithArgs.directParents['@brentbahry/reflection-build-test-a/LocalLoadableInterfaceWithArgs'];
	expect(localLoadableInterfaceWithArgs).toBeTruthy();
	expect(localLoadableInterfaceWithArgs.qualifiedName).toBe('@brentbahry/reflection-build-test-a/LocalLoadableInterfaceWithArgs');
	expect(extendsLocalLoadableInterfaceWithArgs.typeParameters['@brentbahry/reflection-build-test-a/LocalLoadableInterfaceWithArgs']).toBeTruthy();
	expect(extendsLocalLoadableInterfaceWithArgs.typeParameters['@brentbahry/reflection-build-test-a/LocalLoadableInterfaceWithArgs'][0].qualifiedName).toBe('@brentbahry/reflection-build-test-a/LocalLoadableInterface');
});