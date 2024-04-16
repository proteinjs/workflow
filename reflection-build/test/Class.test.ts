import '@proteinjs/reflection-build-test-a';
import { SourceRepository } from '@proteinjs/reflection';

beforeAll(async () => {
	SourceRepository.get();
});

test('can load class', async () => {
	const sourceRepository = SourceRepository.get();
	const localLoadableAbstractClass = sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/LocalLoadableAbstractClass'];
	expect(localLoadableAbstractClass).toBeTruthy();
	expect(localLoadableAbstractClass.qualifiedName).toBe('@proteinjs/reflection-build-test-a/LocalLoadableAbstractClass');
});

test('do not load non-loadable classes', async () => {
	const sourceRepository = SourceRepository.get();
	expect(sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsLocalNotLoadableInterface']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/LocalNotLoadableAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsLocalNotLoadableAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ExtendsLocalNotLoadableAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsExtendsLocalNotLoadableAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsExtendsLocalNotLoadableInterface']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-b/NotLoadableForeignAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsNotLoadableForeignInterface']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsNotLoadableForeignAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsExtendsLocalNotLoadableInterface']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ExtendsNotLoadableForeignAbstractClass']).toBeUndefined();
	expect(sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsExtendsNotLoadableForeignAbstractClass']).toBeUndefined();
});

test('class can extend local interface', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLocalLoadableInterface = sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsLocalLoadableInterface'];
	expect(implementsLocalLoadableInterface).toBeTruthy();
	expect(implementsLocalLoadableInterface.qualifiedName).toBe('@proteinjs/reflection-build-test-a/ImplementsLocalLoadableInterface');
	expect(new implementsLocalLoadableInterface._constructor().a).toBe(1);
	expect(implementsLocalLoadableInterface.directParents['@proteinjs/reflection-build-test-a/LocalLoadableInterface']).toBeTruthy();
	expect(implementsLocalLoadableInterface.allParents['@proteinjs/reflection-build-test-a/LocalLoadableInterface']).toBeTruthy();
	expect(implementsLocalLoadableInterface.rootParents['@proteinjs/reflection-build-test-a/LocalLoadableInterface']).toBeTruthy();
});

test('class can extend foreign interface', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLoadableForeignInterface = sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsLoadableForeignInterface'];
	expect(implementsLoadableForeignInterface).toBeTruthy();
	expect(implementsLoadableForeignInterface.qualifiedName).toBe('@proteinjs/reflection-build-test-a/ImplementsLoadableForeignInterface');
	expect(new implementsLoadableForeignInterface._constructor().z).toBe(1);
	expect(implementsLoadableForeignInterface.directParents['@proteinjs/reflection-build-test-b/LoadableForeignInterface']).toBeTruthy();
	expect(implementsLoadableForeignInterface.allParents['@proteinjs/reflection-build-test-b/LoadableForeignInterface']).toBeTruthy();
	expect(implementsLoadableForeignInterface.rootParents['@proteinjs/reflection-build-test-b/LoadableForeignInterface']).toBeTruthy();
});

test('class can extend local abstract class', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLocalLoadableAbstractClass = sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsLocalLoadableAbstractClass'];
	expect(implementsLocalLoadableAbstractClass).toBeTruthy();
	expect(implementsLocalLoadableAbstractClass.qualifiedName).toBe('@proteinjs/reflection-build-test-a/ImplementsLocalLoadableAbstractClass');
	expect(new implementsLocalLoadableAbstractClass._constructor().a).toBe(1);
	expect(implementsLocalLoadableAbstractClass.directParents['@proteinjs/reflection-build-test-a/LocalLoadableAbstractClass']).toBeTruthy();
	expect(implementsLocalLoadableAbstractClass.allParents['@proteinjs/reflection-build-test-a/LocalLoadableAbstractClass']).toBeTruthy();
	expect(implementsLocalLoadableAbstractClass.rootParents['@proteinjs/reflection-build-test-a/LocalLoadableAbstractClass']).toBeTruthy();
});

test('class can extend foreign abstract class', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLoadableForeignAbstractClass = sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsLoadableForeignAbstractClass'];
	expect(implementsLoadableForeignAbstractClass).toBeTruthy();
	expect(implementsLoadableForeignAbstractClass.qualifiedName).toBe('@proteinjs/reflection-build-test-a/ImplementsLoadableForeignAbstractClass');
	expect(new implementsLoadableForeignAbstractClass._constructor().z).toBe(1);
	expect(implementsLoadableForeignAbstractClass.directParents['@proteinjs/reflection-build-test-b/LoadableForeignAbstractClass']).toBeTruthy();
	expect(implementsLoadableForeignAbstractClass.allParents['@proteinjs/reflection-build-test-b/LoadableForeignAbstractClass']).toBeTruthy();
	expect(implementsLoadableForeignAbstractClass.rootParents['@proteinjs/reflection-build-test-b/LoadableForeignAbstractClass']).toBeTruthy();
});

test('class can extend 2 local interfaces', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsExtendsLocalLoadableInterface = sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsExtendsLocalLoadableInterface'];
	expect(implementsExtendsLocalLoadableInterface).toBeTruthy();
	expect(new implementsExtendsLocalLoadableInterface._constructor().a).toBe(1);
	expect(new implementsExtendsLocalLoadableInterface._constructor().b).toBe(2);
	expect(implementsExtendsLocalLoadableInterface.qualifiedName).toBe('@proteinjs/reflection-build-test-a/ImplementsExtendsLocalLoadableInterface');
	expect(implementsExtendsLocalLoadableInterface.directParents['@proteinjs/reflection-build-test-a/ExtendsLocalLoadableInterface']).toBeTruthy();
	expect(implementsExtendsLocalLoadableInterface.allParents['@proteinjs/reflection-build-test-a/ExtendsLocalLoadableInterface']).toBeTruthy();
	expect(implementsExtendsLocalLoadableInterface.allParents['@proteinjs/reflection-build-test-a/LocalLoadableInterface']).toBeTruthy();
	expect(implementsExtendsLocalLoadableInterface.rootParents['@proteinjs/reflection-build-test-a/LocalLoadableInterface']).toBeTruthy();
});

test('class can extend a local interface and a foreign interface', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsExtendsLoadableForeignInterface = sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsExtendsLoadableForeignInterface'];
	expect(implementsExtendsLoadableForeignInterface).toBeTruthy();
	expect(new implementsExtendsLoadableForeignInterface._constructor().z).toBe(1);
	expect(new implementsExtendsLoadableForeignInterface._constructor().b).toBe(2);
	expect(implementsExtendsLoadableForeignInterface.qualifiedName).toBe('@proteinjs/reflection-build-test-a/ImplementsExtendsLoadableForeignInterface');
	expect(implementsExtendsLoadableForeignInterface.directParents['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignInterface']).toBeTruthy();
	expect(implementsExtendsLoadableForeignInterface.allParents['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignInterface']).toBeTruthy();
	expect(implementsExtendsLoadableForeignInterface.allParents['@proteinjs/reflection-build-test-b/LoadableForeignInterface']).toBeTruthy();
	expect(implementsExtendsLoadableForeignInterface.rootParents['@proteinjs/reflection-build-test-b/LoadableForeignInterface']).toBeTruthy();
});

test('class can extend 2 local abstract classes', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsExtendsLocalLoadableAbstractClass = sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsExtendsLocalLoadableAbstractClass'];
	expect(implementsExtendsLocalLoadableAbstractClass).toBeTruthy();
	expect(new implementsExtendsLocalLoadableAbstractClass._constructor().a).toBe(1);
	expect(new implementsExtendsLocalLoadableAbstractClass._constructor().b).toBe(2);
	expect(implementsExtendsLocalLoadableAbstractClass.qualifiedName).toBe('@proteinjs/reflection-build-test-a/ImplementsExtendsLocalLoadableAbstractClass');
	expect(implementsExtendsLocalLoadableAbstractClass.directParents['@proteinjs/reflection-build-test-a/ExtendsLocalLoadableAbstractClass']).toBeTruthy();
	expect(implementsExtendsLocalLoadableAbstractClass.allParents['@proteinjs/reflection-build-test-a/ExtendsLocalLoadableAbstractClass']).toBeTruthy();
	expect(implementsExtendsLocalLoadableAbstractClass.allParents['@proteinjs/reflection-build-test-a/LocalLoadableAbstractClass']).toBeTruthy();
	expect(implementsExtendsLocalLoadableAbstractClass.rootParents['@proteinjs/reflection-build-test-a/LocalLoadableAbstractClass']).toBeTruthy();
});

test('class can extend a local abstract classes and a foreign abstract class', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsExtendsLoadableForeignAbstractClass = sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsExtendsLoadableForeignAbstractClass'];
	expect(implementsExtendsLoadableForeignAbstractClass).toBeTruthy();
	expect(new implementsExtendsLoadableForeignAbstractClass._constructor().z).toBe(1);
	expect(new implementsExtendsLoadableForeignAbstractClass._constructor().b).toBe(2);
	expect(implementsExtendsLoadableForeignAbstractClass.qualifiedName).toBe('@proteinjs/reflection-build-test-a/ImplementsExtendsLoadableForeignAbstractClass');
	expect(implementsExtendsLoadableForeignAbstractClass.directParents['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignAbstractClass']).toBeTruthy();
	expect(implementsExtendsLoadableForeignAbstractClass.allParents['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignAbstractClass']).toBeTruthy();
	expect(implementsExtendsLoadableForeignAbstractClass.allParents['@proteinjs/reflection-build-test-b/LoadableForeignAbstractClass']).toBeTruthy();
	expect(implementsExtendsLoadableForeignAbstractClass.rootParents['@proteinjs/reflection-build-test-b/LoadableForeignAbstractClass']).toBeTruthy();
});

test('abstract class can be used to find children', async () => {
	const sourceRepository = SourceRepository.get();
	const loadableForeignAbstractClass = sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-b/LoadableForeignAbstractClass'];
	expect(loadableForeignAbstractClass).toBeTruthy();
	expect(loadableForeignAbstractClass.qualifiedName).toBe('@proteinjs/reflection-build-test-b/LoadableForeignAbstractClass');
	expect(loadableForeignAbstractClass.directChildren['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.directChildren['@proteinjs/reflection-build-test-a/ImplementsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.directChildren['@proteinjs/reflection-build-test-a/ImplementsExtendsLoadableForeignAbstractClass']).toBeUndefined();
	expect(loadableForeignAbstractClass.allChildren['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.allChildren['@proteinjs/reflection-build-test-a/ImplementsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.allChildren['@proteinjs/reflection-build-test-a/ImplementsExtendsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.baseChildren['@proteinjs/reflection-build-test-a/ImplementsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.baseChildren['@proteinjs/reflection-build-test-a/ImplementsExtendsLoadableForeignAbstractClass']).toBeTruthy();
	expect(loadableForeignAbstractClass.baseChildren['@proteinjs/reflection-build-test-a/ExtendsLoadableForeignAbstractClass']).toBeUndefined();
});

test('can load class type parameters from interface', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLocalLoadableInterfaceWithArgs = sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsLocalLoadableInterfaceWithArgs'];
	expect(implementsLocalLoadableInterfaceWithArgs).toBeTruthy();
	expect(implementsLocalLoadableInterfaceWithArgs.qualifiedName).toBe('@proteinjs/reflection-build-test-a/ImplementsLocalLoadableInterfaceWithArgs');
	const localLoadableInterfaceWithArgs = implementsLocalLoadableInterfaceWithArgs.directParents['@proteinjs/reflection-build-test-a/LocalLoadableInterfaceWithArgs'];
	expect(localLoadableInterfaceWithArgs).toBeTruthy();
	expect(localLoadableInterfaceWithArgs.qualifiedName).toBe('@proteinjs/reflection-build-test-a/LocalLoadableInterfaceWithArgs');
	expect(implementsLocalLoadableInterfaceWithArgs.typeParameters['@proteinjs/reflection-build-test-a/LocalLoadableInterfaceWithArgs']).toBeTruthy();
	expect(implementsLocalLoadableInterfaceWithArgs.typeParameters['@proteinjs/reflection-build-test-a/LocalLoadableInterfaceWithArgs'][0].qualifiedName).toBe('@proteinjs/reflection-build-test-a/LocalLoadableInterface');
});

test('can load class type parameters from abstract class', async () => {
	const sourceRepository = SourceRepository.get();
	const implementsLocalLoadableAbstractClassWithArgs = sourceRepository.flattenedSourceGraph.classes['@proteinjs/reflection-build-test-a/ImplementsLocalLoadableAbstractClassWithArgs'];
	expect(implementsLocalLoadableAbstractClassWithArgs).toBeTruthy();
	expect(implementsLocalLoadableAbstractClassWithArgs.qualifiedName).toBe('@proteinjs/reflection-build-test-a/ImplementsLocalLoadableAbstractClassWithArgs');
	const localLoadableAbstractClassWithArgs = implementsLocalLoadableAbstractClassWithArgs.directParents['@proteinjs/reflection-build-test-a/LocalLoadableAbstractClassWithArgs'];
	expect(localLoadableAbstractClassWithArgs).toBeTruthy();
	expect(localLoadableAbstractClassWithArgs.qualifiedName).toBe('@proteinjs/reflection-build-test-a/LocalLoadableAbstractClassWithArgs');
	expect(implementsLocalLoadableAbstractClassWithArgs.typeParameters['@proteinjs/reflection-build-test-a/LocalLoadableAbstractClassWithArgs']).toBeTruthy();
	expect(implementsLocalLoadableAbstractClassWithArgs.typeParameters['@proteinjs/reflection-build-test-a/LocalLoadableAbstractClassWithArgs'][0].qualifiedName).toBe('@proteinjs/reflection-build-test-a/LocalLoadableInterface');
});