import '@brentbahry/reflection-build-test-a';
import { SourceRepository } from '@brentbahry/reflection';

beforeAll(async () => {
	SourceRepository.get();
});

test('can load class', async () => {
	const sourceRepository = SourceRepository.get();
	const localLoadableAbstractClass = sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/LocalLoadableAbstractClass'];
	expect(localLoadableAbstractClass).toBeTruthy();
	expect(localLoadableAbstractClass.qualifiedName).toBe('@brentbahry/reflection-build-test-a/LocalLoadableAbstractClass');
});

test('do not load non-loadable classes', async () => {
	const sourceRepository = SourceRepository.get();
	expect(sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsLocalNotLoadableInterface']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/LocalNotLoadableAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsLocalNotLoadableAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ExtendsLocalNotLoadableAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsExtendsLocalNotLoadableAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsExtendsLocalNotLoadableInterface']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-b/NotLoadableForeignAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsNotLoadableForeignInterface']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsNotLoadableForeignAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsExtendsLocalNotLoadableInterface']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ExtendsNotLoadableForeignAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsExtendsNotLoadableForeignAbstractClass']).toBeUndefined();
});

test('class can extend local interface', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLocalLoadableInterface = sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsLocalLoadableInterface'];
	expect(implementsLocalLoadableInterface).toBeTruthy();
	expect(implementsLocalLoadableInterface.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ImplementsLocalLoadableInterface');
	expect(new implementsLocalLoadableInterface._constructor().a).toBe(1);
	expect(implementsLocalLoadableInterface.directParents['@brentbahry/reflection-build-test-a/LocalLoadableInterface']).toBeTruthy();
	expect(implementsLocalLoadableInterface.allParents['@brentbahry/reflection-build-test-a/LocalLoadableInterface']).toBeTruthy();
	expect(implementsLocalLoadableInterface.rootParents['@brentbahry/reflection-build-test-a/LocalLoadableInterface']).toBeTruthy();
});

test('class can extend foreign interface', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLoadableForeignInterface = sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsLoadableForeignInterface'];
	expect(implementsLoadableForeignInterface).toBeTruthy();
	expect(implementsLoadableForeignInterface.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ImplementsLoadableForeignInterface');
	expect(new implementsLoadableForeignInterface._constructor().z).toBe(1);
	expect(implementsLoadableForeignInterface.directParents['@brentbahry/reflection-build-test-b/LoadableForeignInterface']).toBeTruthy();
	expect(implementsLoadableForeignInterface.allParents['@brentbahry/reflection-build-test-b/LoadableForeignInterface']).toBeTruthy();
	expect(implementsLoadableForeignInterface.rootParents['@brentbahry/reflection-build-test-b/LoadableForeignInterface']).toBeTruthy();
});

test('class can extend local abstract class', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLocalLoadableAbstractClass = sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsLocalLoadableAbstractClass'];
	expect(implementsLocalLoadableAbstractClass).toBeTruthy();
	expect(implementsLocalLoadableAbstractClass.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ImplementsLocalLoadableAbstractClass');
	expect(new implementsLocalLoadableAbstractClass._constructor().a).toBe(1);
	expect(implementsLocalLoadableAbstractClass.directParents['@brentbahry/reflection-build-test-a/LocalLoadableAbstractClass']).toBeTruthy();
	expect(implementsLocalLoadableAbstractClass.allParents['@brentbahry/reflection-build-test-a/LocalLoadableAbstractClass']).toBeTruthy();
	expect(implementsLocalLoadableAbstractClass.rootParents['@brentbahry/reflection-build-test-a/LocalLoadableAbstractClass']).toBeTruthy();
});

test('class can extend foreign abstract class', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLoadableForeignAbstractClass = sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsLoadableForeignAbstractClass'];
	expect(implementsLoadableForeignAbstractClass).toBeTruthy();
	expect(implementsLoadableForeignAbstractClass.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ImplementsLoadableForeignAbstractClass');
	expect(new implementsLoadableForeignAbstractClass._constructor().z).toBe(1);
	expect(implementsLoadableForeignAbstractClass.directParents['@brentbahry/reflection-build-test-b/LoadableForeignAbstractClass']).toBeTruthy();
	expect(implementsLoadableForeignAbstractClass.allParents['@brentbahry/reflection-build-test-b/LoadableForeignAbstractClass']).toBeTruthy();
	expect(implementsLoadableForeignAbstractClass.rootParents['@brentbahry/reflection-build-test-b/LoadableForeignAbstractClass']).toBeTruthy();
});

test('class can extend 2 local interfaces', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsExtendsLocalLoadableInterface = sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsExtendsLocalLoadableInterface'];
	expect(implementsExtendsLocalLoadableInterface).toBeTruthy();
	expect(new implementsExtendsLocalLoadableInterface._constructor().a).toBe(1);
	expect(new implementsExtendsLocalLoadableInterface._constructor().b).toBe(2);
	expect(implementsExtendsLocalLoadableInterface.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ImplementsExtendsLocalLoadableInterface');
	expect(implementsExtendsLocalLoadableInterface.directParents['@brentbahry/reflection-build-test-a/ExtendsLocalLoadableInterface']).toBeTruthy();
	expect(implementsExtendsLocalLoadableInterface.allParents['@brentbahry/reflection-build-test-a/ExtendsLocalLoadableInterface']).toBeTruthy();
	expect(implementsExtendsLocalLoadableInterface.allParents['@brentbahry/reflection-build-test-a/LocalLoadableInterface']).toBeTruthy();
	expect(implementsExtendsLocalLoadableInterface.rootParents['@brentbahry/reflection-build-test-a/LocalLoadableInterface']).toBeTruthy();
});

test('class can extend a local interface and a foreign interface', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsExtendsLoadableForeignInterface = sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsExtendsLoadableForeignInterface'];
	expect(implementsExtendsLoadableForeignInterface).toBeTruthy();
	expect(new implementsExtendsLoadableForeignInterface._constructor().z).toBe(1);
	expect(new implementsExtendsLoadableForeignInterface._constructor().b).toBe(2);
	expect(implementsExtendsLoadableForeignInterface.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ImplementsExtendsLoadableForeignInterface');
	expect(implementsExtendsLoadableForeignInterface.directParents['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignInterface']).toBeTruthy();
	expect(implementsExtendsLoadableForeignInterface.allParents['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignInterface']).toBeTruthy();
	expect(implementsExtendsLoadableForeignInterface.allParents['@brentbahry/reflection-build-test-b/LoadableForeignInterface']).toBeTruthy();
	expect(implementsExtendsLoadableForeignInterface.rootParents['@brentbahry/reflection-build-test-b/LoadableForeignInterface']).toBeTruthy();
});

test('class can extend 2 local abstract classes', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsExtendsLocalLoadableAbstractClass = sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsExtendsLocalLoadableAbstractClass'];
	expect(implementsExtendsLocalLoadableAbstractClass).toBeTruthy();
	expect(new implementsExtendsLocalLoadableAbstractClass._constructor().a).toBe(1);
	expect(new implementsExtendsLocalLoadableAbstractClass._constructor().b).toBe(2);
	expect(implementsExtendsLocalLoadableAbstractClass.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ImplementsExtendsLocalLoadableAbstractClass');
	expect(implementsExtendsLocalLoadableAbstractClass.directParents['@brentbahry/reflection-build-test-a/ExtendsLocalLoadableAbstractClass']).toBeTruthy();
	expect(implementsExtendsLocalLoadableAbstractClass.allParents['@brentbahry/reflection-build-test-a/ExtendsLocalLoadableAbstractClass']).toBeTruthy();
	expect(implementsExtendsLocalLoadableAbstractClass.allParents['@brentbahry/reflection-build-test-a/LocalLoadableAbstractClass']).toBeTruthy();
	expect(implementsExtendsLocalLoadableAbstractClass.rootParents['@brentbahry/reflection-build-test-a/LocalLoadableAbstractClass']).toBeTruthy();
});

test('class can extend a local abstract classes and a foreign abstract class', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsExtendsLoadableForeignAbstractClass = sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsExtendsLoadableForeignAbstractClass'];
	expect(implementsExtendsLoadableForeignAbstractClass).toBeTruthy();
	expect(new implementsExtendsLoadableForeignAbstractClass._constructor().z).toBe(1);
	expect(new implementsExtendsLoadableForeignAbstractClass._constructor().b).toBe(2);
	expect(implementsExtendsLoadableForeignAbstractClass.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ImplementsExtendsLoadableForeignAbstractClass');
	expect(implementsExtendsLoadableForeignAbstractClass.directParents['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignAbstractClass']).toBeTruthy();
	expect(implementsExtendsLoadableForeignAbstractClass.allParents['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignAbstractClass']).toBeTruthy();
	expect(implementsExtendsLoadableForeignAbstractClass.allParents['@brentbahry/reflection-build-test-b/LoadableForeignAbstractClass']).toBeTruthy();
	expect(implementsExtendsLoadableForeignAbstractClass.rootParents['@brentbahry/reflection-build-test-b/LoadableForeignAbstractClass']).toBeTruthy();
});

test('abstract class can be used to find children', async () => {
	const sourceRepository = SourceRepository.get();
	const loadableForeignAbstractClass = sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-b/LoadableForeignAbstractClass'];
	expect(loadableForeignAbstractClass).toBeTruthy();
	expect(loadableForeignAbstractClass.qualifiedName).toBe('@brentbahry/reflection-build-test-b/LoadableForeignAbstractClass');
	expect(loadableForeignAbstractClass.directChildren['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.directChildren['@brentbahry/reflection-build-test-a/ImplementsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.directChildren['@brentbahry/reflection-build-test-a/ImplementsExtendsLoadableForeignAbstractClass']).toBeUndefined();
	expect(loadableForeignAbstractClass.allChildren['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.allChildren['@brentbahry/reflection-build-test-a/ImplementsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.allChildren['@brentbahry/reflection-build-test-a/ImplementsExtendsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.baseChildren['@brentbahry/reflection-build-test-a/ImplementsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.baseChildren['@brentbahry/reflection-build-test-a/ImplementsExtendsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.baseChildren['@brentbahry/reflection-build-test-a/ExtendsLoadableForeignAbstractClass']).toBeUndefined();
});

test('can load class type parameters from interface', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLocalLoadableInterfaceWithArgs = sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsLocalLoadableInterfaceWithArgs'];
	expect(implementsLocalLoadableInterfaceWithArgs).toBeTruthy();
	expect(implementsLocalLoadableInterfaceWithArgs.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ImplementsLocalLoadableInterfaceWithArgs');
	const localLoadableInterfaceWithArgs = implementsLocalLoadableInterfaceWithArgs.directParents['@brentbahry/reflection-build-test-a/LocalLoadableInterfaceWithArgs'];
	expect(localLoadableInterfaceWithArgs).toBeTruthy();
	expect(localLoadableInterfaceWithArgs.qualifiedName).toBe('@brentbahry/reflection-build-test-a/LocalLoadableInterfaceWithArgs');
	expect(implementsLocalLoadableInterfaceWithArgs.typeParameters['@brentbahry/reflection-build-test-a/LocalLoadableInterfaceWithArgs']).toBeTruthy();
	expect(implementsLocalLoadableInterfaceWithArgs.typeParameters['@brentbahry/reflection-build-test-a/LocalLoadableInterfaceWithArgs'][0].qualifiedName).toBe('@brentbahry/reflection-build-test-a/LocalLoadableInterface');
});

test('can load class type parameters from abstract class', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLocalLoadableAbstractClassWithArgs = sourceRepository.flattenedSourceGraph.classes['@brentbahry/reflection-build-test-a/ImplementsLocalLoadableAbstractClassWithArgs'];
	expect(implementsLocalLoadableAbstractClassWithArgs).toBeTruthy();
	expect(implementsLocalLoadableAbstractClassWithArgs.qualifiedName).toBe('@brentbahry/reflection-build-test-a/ImplementsLocalLoadableAbstractClassWithArgs');
	const localLoadableAbstractClassWithArgs = implementsLocalLoadableAbstractClassWithArgs.directParents['@brentbahry/reflection-build-test-a/LocalLoadableAbstractClassWithArgs'];
	expect(localLoadableAbstractClassWithArgs).toBeTruthy();
	expect(localLoadableAbstractClassWithArgs.qualifiedName).toBe('@brentbahry/reflection-build-test-a/LocalLoadableAbstractClassWithArgs');
	expect(implementsLocalLoadableAbstractClassWithArgs.typeParameters['@brentbahry/reflection-build-test-a/LocalLoadableAbstractClassWithArgs']).toBeTruthy();
	expect(implementsLocalLoadableAbstractClassWithArgs.typeParameters['@brentbahry/reflection-build-test-a/LocalLoadableAbstractClassWithArgs'][0].qualifiedName).toBe('@brentbahry/reflection-build-test-a/LocalLoadableInterface');
});