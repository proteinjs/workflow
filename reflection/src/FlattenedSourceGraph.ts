import { Graph, alg } from '@dagrejs/graphlib';
import { ClassDeclaration, VariableDeclaration, Variable, TypeAlias, Class, Interface, TypeAliasDeclaration, InterfaceDeclaration } from './types';
import { LOADABLE_QUALIFIED_NAME } from './Loadable';

export type FlattenedSourceGraph = {
	variables: { [qualifiedName: string]: Variable; };
	typeAliases: { [qualifiedName: string]: TypeAlias; };
	classes: { [qualifiedName: string]: Class; };
	interfaces: { [qualifiedName: string]: Interface; };
};

export function flattenSourceGraph(sourceGraph: Graph, sourceLinks: { [qualifiedName: string]: any }): FlattenedSourceGraph {
	const flattenedSourceGraph: FlattenedSourceGraph = {
		variables: {},
		typeAliases: {},
		classes: {},
		interfaces: {}
	};
	sourceGraph.setNode(LOADABLE_QUALIFIED_NAME, new InterfaceDeclaration('@proteinjs/reflection', 'Loadable', [], [], [], []));
	flattenParents(sourceGraph, sourceLinks, flattenedSourceGraph);
	flattenChildren(sourceGraph, sourceLinks, flattenedSourceGraph);
	addTypeParameters(flattenedSourceGraph, sourceGraph);
	pruneNonLoadables(flattenedSourceGraph);
	return flattenedSourceGraph;
}

function flattenParents(sourceGraph: Graph, sourceLinks: { [qualifiedName: string]: any }, flattenedSourceGraph: FlattenedSourceGraph): void {
	for (const nodeName of alg.topsort(sourceGraph).reverse()) {
		const node = sourceGraph.node(nodeName);
		if (!node)
			continue;

		if (node instanceof InterfaceDeclaration)
			loadInterfaceAndParents(node, sourceGraph, sourceLinks, flattenedSourceGraph);
		else if (node instanceof TypeAliasDeclaration)
			loadTypeAliasAndParents(node, sourceGraph, sourceLinks, flattenedSourceGraph);
		else if (node instanceof ClassDeclaration)
			loadClassAndParents(node, sourceGraph, sourceLinks, flattenedSourceGraph);
		else if (node instanceof VariableDeclaration)
			loadVariableAndParents(node, sourceGraph, sourceLinks, flattenedSourceGraph);
	}
}

function flattenChildren(sourceGraph: Graph, sourceLinks: { [qualifiedName: string]: any }, flattenedSourceGraph: FlattenedSourceGraph): void {
	for (const nodeName of alg.topsort(sourceGraph)) {
		const node = sourceGraph.node(nodeName);
		if (!node)
			continue;
		
		if (node instanceof TypeAliasDeclaration)
			loadTypeAliasAndChildren(node, sourceGraph, flattenedSourceGraph);
		else if (node instanceof InterfaceDeclaration)
			loadInterfaceAndChildren(node, sourceGraph, flattenedSourceGraph);
		else if (node instanceof ClassDeclaration)
			loadClassAndChildren(node, sourceGraph, sourceLinks, flattenedSourceGraph);
		else if (node instanceof VariableDeclaration)
			getOrCreateVariable(node, sourceLinks, flattenedSourceGraph);
	}
}

function isRootParent(type: TypeAlias|Class|Interface): boolean {
	if (Object.keys(type.directParents).length === 0 && type.directParents.constructor === Object)
		return true;

	if (type.directParents[LOADABLE_QUALIFIED_NAME])
		return true;

	return false;
}

function loadTypeAliasAndParents(typeAliasDeclaration: TypeAliasDeclaration, sourceGraph: Graph, sourceLinks: { [qualifiedName: string]: any }, flattenedSourceGraph: FlattenedSourceGraph): void {
	if (!flattenedSourceGraph.typeAliases[typeAliasDeclaration.qualifiedName])
		flattenedSourceGraph.typeAliases[typeAliasDeclaration.qualifiedName] = new TypeAlias(typeAliasDeclaration.packageName, typeAliasDeclaration.name, typeAliasDeclaration.filePath);
	
	const typeAlias = flattenedSourceGraph.typeAliases[typeAliasDeclaration.qualifiedName];
	const outEdges = sourceGraph.outEdges(typeAliasDeclaration.qualifiedName);
	if (outEdges) {
		for (const outEdge of outEdges) {
			const node = sourceGraph.node(outEdge.w);
			if (!node)
				continue;

			if (node instanceof TypeAliasDeclaration) {
				const parentTypeAlias = flattenedSourceGraph.typeAliases[outEdge.w];
				if (!parentTypeAlias)
					continue;

				typeAlias.directParents[parentTypeAlias.qualifiedName] = parentTypeAlias;
				typeAlias.allParents[parentTypeAlias.qualifiedName] = parentTypeAlias;
				typeAlias.allParents = Object.assign(typeAlias.allParents, parentTypeAlias.allParents);
				if (isRootParent(parentTypeAlias))
					typeAlias.rootParents[parentTypeAlias.qualifiedName] = parentTypeAlias;
				else
					typeAlias.rootParents = Object.assign(typeAlias.rootParents, parentTypeAlias.rootParents);
			} else if (node instanceof InterfaceDeclaration) {
				const parentInterface = flattenedSourceGraph.interfaces[outEdge.w];
				if (!parentInterface)
					continue;

				typeAlias.directParents[parentInterface.qualifiedName] = parentInterface;
				typeAlias.allParents[parentInterface.qualifiedName] = parentInterface;
				typeAlias.allParents = Object.assign(typeAlias.allParents, parentInterface.allParents);
				if (isRootParent(parentInterface))
					typeAlias.rootParents[parentInterface.qualifiedName] = parentInterface;
				else
					typeAlias.rootParents = Object.assign(typeAlias.rootParents, parentInterface.rootParents);
			}
		}
	}
}

function loadInterfaceAndParents(interfaceDeclaration: InterfaceDeclaration, sourceGraph: Graph, sourceLinks: { [qualifiedName: string]: any }, flattenedSourceGraph: FlattenedSourceGraph): void {
	if (!flattenedSourceGraph.interfaces[interfaceDeclaration.qualifiedName])
		flattenedSourceGraph.interfaces[interfaceDeclaration.qualifiedName] = new Interface(interfaceDeclaration.packageName, interfaceDeclaration.name, interfaceDeclaration.properties, interfaceDeclaration.methods, interfaceDeclaration.filePath);
	
	const _interface = flattenedSourceGraph.interfaces[interfaceDeclaration.qualifiedName];
	const outEdges = sourceGraph.outEdges(interfaceDeclaration.qualifiedName);
	if (outEdges) {
		for (const outEdge of outEdges) {
			const node = sourceGraph.node(outEdge.w);
			if (!node)
				continue;

			if (node instanceof InterfaceDeclaration) {
				const parentInterface = flattenedSourceGraph.interfaces[outEdge.w];
				if (!parentInterface)
					continue;

				_interface.directParents[parentInterface.qualifiedName] = parentInterface;
				_interface.allParents[parentInterface.qualifiedName] = parentInterface;
				_interface.allParents = Object.assign(_interface.allParents, parentInterface.allParents);
				if (isRootParent(parentInterface))
					_interface.rootParents[parentInterface.qualifiedName] = parentInterface;
				else
					_interface.rootParents = Object.assign(_interface.rootParents, parentInterface.rootParents);
			} else if (node instanceof TypeAliasDeclaration) {
				const parentTypeAlias = flattenedSourceGraph.typeAliases[outEdge.w];
				if (!parentTypeAlias)
					continue;

				_interface.directParents[parentTypeAlias.qualifiedName] = parentTypeAlias;
				_interface.allParents[parentTypeAlias.qualifiedName] = parentTypeAlias;
				_interface.allParents = Object.assign(_interface.allParents, parentTypeAlias.allParents);
				if (isRootParent(parentTypeAlias))
					_interface.rootParents[parentTypeAlias.qualifiedName] = parentTypeAlias;
				else
					_interface.rootParents = Object.assign(_interface.rootParents, parentTypeAlias.rootParents);
			}
		}
	}
}

function loadClassAndParents(classDeclaration: ClassDeclaration, sourceGraph: Graph, sourceLinks: { [qualifiedName: string]: any }, flattenedSourceGraph: FlattenedSourceGraph): void {
	if (!flattenedSourceGraph.classes[classDeclaration.qualifiedName])
		flattenedSourceGraph.classes[classDeclaration.qualifiedName] = new Class(classDeclaration.packageName, classDeclaration.name, classDeclaration.filePath as string, classDeclaration.isAbstract, classDeclaration.isStatic, classDeclaration.visibility, classDeclaration.properties, classDeclaration.methods, sourceLinks[classDeclaration.qualifiedName]);
	
	const _class = flattenedSourceGraph.classes[classDeclaration.qualifiedName];
	const outEdges = sourceGraph.outEdges(classDeclaration.qualifiedName);
	if (outEdges) {
		for (const outEdge of outEdges) {
			const node = sourceGraph.node(outEdge.w);
			if (!node)
				continue;

			if (node instanceof ClassDeclaration) {
				const parentClass = flattenedSourceGraph.classes[outEdge.w];
				if (!parentClass)
					continue;

				_class.directParents[parentClass.qualifiedName] = parentClass;
				_class.allParents[parentClass.qualifiedName] = parentClass;
				_class.allParents = Object.assign(_class.allParents, parentClass.allParents);
				if (isRootParent(parentClass))
					_class.rootParents[parentClass.qualifiedName] = parentClass;
				else
					_class.rootParents = Object.assign(_class.rootParents, parentClass.rootParents);
			} else if (node instanceof InterfaceDeclaration) {
				const parentInterface = flattenedSourceGraph.interfaces[outEdge.w];
				if (!parentInterface)
					continue;

				_class.directParents[parentInterface.qualifiedName] = parentInterface;
				_class.allParents[parentInterface.qualifiedName] = parentInterface;
				_class.allParents = Object.assign(_class.allParents, parentInterface.allParents);
				if (isRootParent(parentInterface))
					_class.rootParents[parentInterface.qualifiedName] = parentInterface;
				else
					_class.rootParents = Object.assign(_class.rootParents, parentInterface.rootParents);
			} else if (node instanceof TypeAliasDeclaration) {
				const parentTypeAlias = flattenedSourceGraph.typeAliases[outEdge.w];
				if (!parentTypeAlias)
					continue;

				_class.directParents[parentTypeAlias.qualifiedName] = parentTypeAlias;
				_class.allParents[parentTypeAlias.qualifiedName] = parentTypeAlias;
				_class.allParents = Object.assign(_class.allParents, parentTypeAlias.allParents);
				if (isRootParent(parentTypeAlias))
					_class.rootParents[parentTypeAlias.qualifiedName] = parentTypeAlias;
				else
					_class.rootParents = Object.assign(_class.rootParents, parentTypeAlias.rootParents);
			}
		}
	}
}

function loadVariableAndParents(variableDeclaration: VariableDeclaration, sourceGraph: Graph, sourceLinks: { [qualifiedName: string]: any }, flattenedSourceGraph: FlattenedSourceGraph): void {
	const variable = getOrCreateVariable(variableDeclaration, sourceLinks, flattenedSourceGraph);
	const outEdges = sourceGraph.outEdges(variableDeclaration.qualifiedName);
	if (outEdges) {
		for (const outEdge of outEdges) {
			const node = sourceGraph.node(outEdge.w);
			if (!node)
				continue;

			if (node instanceof TypeAliasDeclaration) {
				const parentTypeAlias = flattenedSourceGraph.typeAliases[outEdge.w];
				if (!parentTypeAlias)
					continue;

				variable.directParentTypes[parentTypeAlias.qualifiedName] = parentTypeAlias;
				variable.allParentTypes[parentTypeAlias.qualifiedName] = parentTypeAlias;
				variable.allParentTypes = Object.assign(variable.allParentTypes, parentTypeAlias.allParents);
				if (isRootParent(parentTypeAlias))
					variable.rootParentTypes[parentTypeAlias.qualifiedName] = parentTypeAlias;
				else
					variable.rootParentTypes = Object.assign(variable.rootParentTypes, parentTypeAlias.rootParents);
			} else if (node instanceof InterfaceDeclaration) {
				const parentInterface = flattenedSourceGraph.interfaces[outEdge.w];
				if (!parentInterface)
					continue;

				variable.directParentTypes[parentInterface.qualifiedName] = parentInterface;
				variable.allParentTypes[parentInterface.qualifiedName] = parentInterface;
				variable.allParentTypes = Object.assign(variable.allParentTypes, parentInterface.allParents);
				if (isRootParent(parentInterface))
					variable.rootParentTypes[parentInterface.qualifiedName] = parentInterface;
				else
					variable.rootParentTypes = Object.assign(variable.rootParentTypes, parentInterface.rootParents);
			}
		}
	}
}

function getOrCreateVariable(variableDeclaration: VariableDeclaration, sourceLinks: { [qualifiedName: string]: any }, flattenedSourceGraph: FlattenedSourceGraph): Variable {
	if (flattenedSourceGraph.variables[variableDeclaration.qualifiedName])
		return flattenedSourceGraph.variables[variableDeclaration.qualifiedName];

	const variable = new Variable(variableDeclaration.packageName, variableDeclaration.name, variableDeclaration.filePath as string, variableDeclaration.isExported, variableDeclaration.isConst, sourceLinks[variableDeclaration.qualifiedName]);
	flattenedSourceGraph.variables[variableDeclaration.qualifiedName] = variable;
	return variable;
}

function loadTypeAliasAndChildren(typeAliasDeclaration: TypeAliasDeclaration, sourceGraph: Graph, flattenedSourceGraph: FlattenedSourceGraph): void {
	if (!flattenedSourceGraph.typeAliases[typeAliasDeclaration.qualifiedName])
		flattenedSourceGraph.typeAliases[typeAliasDeclaration.qualifiedName] = new TypeAlias(typeAliasDeclaration.packageName, typeAliasDeclaration.name, typeAliasDeclaration.filePath);
	
	const typeAlias = flattenedSourceGraph.typeAliases[typeAliasDeclaration.qualifiedName];
	const inEdges = sourceGraph.inEdges(typeAliasDeclaration.qualifiedName);
	if (inEdges) {
		for (const inEdge of inEdges) {
			const node = sourceGraph.node(inEdge.v);
			if (!node)
				continue;

			if (node instanceof TypeAliasDeclaration) {
				const childTypeAlias = flattenedSourceGraph.typeAliases[node.qualifiedName];
				if (!childTypeAlias)
					continue;

				typeAlias.directChildren[childTypeAlias.qualifiedName] = childTypeAlias;
				typeAlias.allChildren[childTypeAlias.qualifiedName] = childTypeAlias;
				typeAlias.allChildren = Object.assign(typeAlias.allChildren, childTypeAlias.allChildren);
				if (Object.keys(childTypeAlias.directChildren).length === 0 && childTypeAlias.directChildren.constructor === Object)
					typeAlias.baseChildren[childTypeAlias.qualifiedName] = childTypeAlias;
				else
					typeAlias.baseChildren = Object.assign(typeAlias.baseChildren, childTypeAlias.baseChildren);
			} else if (node instanceof InterfaceDeclaration) {
				const childInterface = flattenedSourceGraph.interfaces[node.qualifiedName];
				if (!childInterface)
					continue;

				typeAlias.directChildren[childInterface.qualifiedName] = childInterface;
				typeAlias.allChildren[childInterface.qualifiedName] = childInterface;
				typeAlias.allChildren = Object.assign(typeAlias.allChildren, childInterface.allChildren);
				if (Object.keys(childInterface.directChildren).length === 0 && childInterface.directChildren.constructor === Object)
					typeAlias.baseChildren[childInterface.qualifiedName] = childInterface;
				else
					typeAlias.baseChildren = Object.assign(typeAlias.baseChildren, childInterface.baseChildren);
			} else if (node instanceof VariableDeclaration) {
				const childVariable = flattenedSourceGraph.variables[node.qualifiedName];
				if (!childVariable)
					continue;

				typeAlias.directChildren[childVariable.qualifiedName] = childVariable;
				typeAlias.allChildren[childVariable.qualifiedName] = childVariable;
				typeAlias.baseChildren[childVariable.qualifiedName] = childVariable;
			} else if (node instanceof ClassDeclaration) {
				const childClass = flattenedSourceGraph.classes[node.qualifiedName];
				if (!childClass)
					continue;

				typeAlias.directChildren[childClass.qualifiedName] = childClass;
				typeAlias.allChildren[childClass.qualifiedName] = childClass;
				typeAlias.baseChildren[childClass.qualifiedName] = childClass;
			}
		}
	}
}

function loadInterfaceAndChildren(interfaceDeclaration: InterfaceDeclaration, sourceGraph: Graph, flattenedSourceGraph: FlattenedSourceGraph): void {
	if (!flattenedSourceGraph.interfaces[interfaceDeclaration.qualifiedName])
		flattenedSourceGraph.interfaces[interfaceDeclaration.qualifiedName] = new Interface(interfaceDeclaration.packageName, interfaceDeclaration.name, interfaceDeclaration.properties, interfaceDeclaration.methods, interfaceDeclaration.filePath);
	
	const _interface = flattenedSourceGraph.interfaces[interfaceDeclaration.qualifiedName];
	const inEdges = sourceGraph.inEdges(interfaceDeclaration.qualifiedName);
	if (inEdges) {
		for (const inEdge of inEdges) {
			const node = sourceGraph.node(inEdge.v);
			if (!node)
				continue;

			if (node instanceof InterfaceDeclaration) {
				const childInterface = flattenedSourceGraph.interfaces[node.qualifiedName];
				if (!childInterface)
					continue;

				_interface.directChildren[childInterface.qualifiedName] = childInterface;
				_interface.allChildren[childInterface.qualifiedName] = childInterface;
				_interface.allChildren = Object.assign(_interface.allChildren, childInterface.allChildren);
				if (Object.keys(childInterface.directChildren).length === 0 && childInterface.directChildren.constructor === Object)
					_interface.baseChildren[childInterface.qualifiedName] = childInterface;
				else
					_interface.baseChildren = Object.assign(_interface.baseChildren, childInterface.baseChildren);
			} else if (node instanceof TypeAliasDeclaration) {
				const childTypeAlias = flattenedSourceGraph.typeAliases[node.qualifiedName];
				if (!childTypeAlias)
					continue;

				_interface.directChildren[childTypeAlias.qualifiedName] = childTypeAlias;
				_interface.allChildren[childTypeAlias.qualifiedName] = childTypeAlias;
				_interface.allChildren = Object.assign(_interface.allChildren, childTypeAlias.allChildren);
				if (Object.keys(childTypeAlias.directChildren).length === 0 && childTypeAlias.directChildren.constructor === Object)
					_interface.baseChildren[childTypeAlias.qualifiedName] = childTypeAlias;
				else
					_interface.baseChildren = Object.assign(_interface.baseChildren, childTypeAlias.baseChildren);
			} else if (node instanceof ClassDeclaration) {
				const childClass = flattenedSourceGraph.classes[node.qualifiedName];
				if (!childClass)
					continue;

				_interface.directChildren[childClass.qualifiedName] = childClass;
				_interface.allChildren[childClass.qualifiedName] = childClass;
				_interface.allChildren = Object.assign(_interface.allChildren, childClass.allChildren);
				if (Object.keys(childClass.directChildren).length === 0 && childClass.directChildren.constructor === Object)
					_interface.baseChildren[childClass.qualifiedName] = childClass;
				else
					_interface.baseChildren = Object.assign(_interface.baseChildren, childClass.baseChildren);
			} else if (node instanceof VariableDeclaration) {
				const childVariable = flattenedSourceGraph.variables[node.qualifiedName];
				if (!childVariable)
					continue;

				_interface.directChildren[childVariable.qualifiedName] = childVariable;
				_interface.allChildren[childVariable.qualifiedName] = childVariable;
				_interface.baseChildren[childVariable.qualifiedName] = childVariable;
			}
		}
	}
}

function loadClassAndChildren(classDeclaration: ClassDeclaration, sourceGraph: Graph, sourceLinks: { [qualifiedName: string]: any }, flattenedSourceGraph: FlattenedSourceGraph): void {
	if (!flattenedSourceGraph.classes[classDeclaration.qualifiedName])
		flattenedSourceGraph.classes[classDeclaration.qualifiedName] = new Class(classDeclaration.packageName, classDeclaration.name, classDeclaration.filePath as string, classDeclaration.isAbstract, classDeclaration.isStatic, classDeclaration.visibility, classDeclaration.properties, classDeclaration.methods, sourceLinks[classDeclaration.qualifiedName]);
	
	const _class = flattenedSourceGraph.classes[classDeclaration.qualifiedName];
	const inEdges = sourceGraph.inEdges(classDeclaration.qualifiedName);
	if (inEdges) {
		for (const inEdge of inEdges) {
			const node = sourceGraph.node(inEdge.v);
			if (!node)
				continue;

			if (node instanceof ClassDeclaration) {
				const childClass = flattenedSourceGraph.classes[node.qualifiedName];
				if (!childClass)
					continue;

				_class.directChildren[childClass.qualifiedName] = childClass;
				_class.allChildren[childClass.qualifiedName] = childClass;
				_class.allChildren = Object.assign(_class.allChildren, childClass.allChildren);
				if (Object.keys(childClass.directChildren).length === 0 && childClass.directChildren.constructor === Object)
					_class.baseChildren[childClass.qualifiedName] = childClass;
				else
					_class.baseChildren = Object.assign(_class.baseChildren, childClass.baseChildren);
			}
		}
	}
}

function addTypeParameters(flattenedSourceGraph: FlattenedSourceGraph, sourceGraph: Graph): void {
	for (const typeAliasName of Object.keys(flattenedSourceGraph.typeAliases)) {
		const typeAlias = flattenedSourceGraph.typeAliases[typeAliasName];
		const typeAliasDeclaration: TypeAliasDeclaration = sourceGraph.node(typeAliasName);
		if (!typeAliasDeclaration)
			continue;

		if (!typeAliasDeclaration.directParents)
			continue;

		addTypeParametersToSource(typeAlias, typeAliasDeclaration.directParents, flattenedSourceGraph);
	}

	for (const interfaceName of Object.keys(flattenedSourceGraph.interfaces)) {
		const _interface = flattenedSourceGraph.interfaces[interfaceName];
		const interfaceDeclaration: InterfaceDeclaration = sourceGraph.node(interfaceName);
		if (!interfaceDeclaration)
			continue;

		addTypeParametersToSource(_interface, interfaceDeclaration.directParents, flattenedSourceGraph);
	}

	for (const className of Object.keys(flattenedSourceGraph.classes)) {
		const _class = flattenedSourceGraph.classes[className];
		const classDeclaration: ClassDeclaration = sourceGraph.node(className);
		if (!classDeclaration)
			continue;

		addTypeParametersToSource(_class, classDeclaration.directParentClasses, flattenedSourceGraph);
		addTypeParametersToSource(_class, classDeclaration.directParentInterfaces, flattenedSourceGraph);
	}

	for (const variableName of Object.keys(flattenedSourceGraph.variables)) {
		const variable = flattenedSourceGraph.variables[variableName];
		const variableDeclaration: VariableDeclaration = sourceGraph.node(variableName);
		if (!variableDeclaration)
			continue;

		if (!variableDeclaration.type)
			continue;

		if (!variableDeclaration.type.directParents)
			continue;
		
		addTypeParametersToSource(variable, variableDeclaration.type.directParents, flattenedSourceGraph);
	}
}

function addTypeParametersToSource(source: Class|Interface|Variable|TypeAlias, parentDeclarations: (ClassDeclaration|InterfaceDeclaration|TypeAliasDeclaration)[], flattenedSourceGraph: FlattenedSourceGraph): void {
	if (!parentDeclarations)
		return;

	for (const parentDeclaration of parentDeclarations) {
		if (!parentDeclaration.typeParameters)
			continue;

		for (const typeParameter of parentDeclaration.typeParameters) {
			if (!source.typeParameters[parentDeclaration.qualifiedName])
				source.typeParameters[parentDeclaration.qualifiedName] = [];

			if (flattenedSourceGraph.typeAliases[typeParameter])
				source.typeParameters[parentDeclaration.qualifiedName].push(flattenedSourceGraph.typeAliases[typeParameter]);
			else if (flattenedSourceGraph.interfaces[typeParameter])
				source.typeParameters[parentDeclaration.qualifiedName].push(flattenedSourceGraph.interfaces[typeParameter]);
		}
	}
}

function pruneNonLoadables(flattenedSourceGraph: FlattenedSourceGraph): void {
	for (const variableQualifiedName of Object.keys(flattenedSourceGraph.variables)) {
		const variable = flattenedSourceGraph.variables[variableQualifiedName];
		if (!variable.allParentTypes[LOADABLE_QUALIFIED_NAME])
			delete flattenedSourceGraph.variables[variableQualifiedName];
	}

	for (const qualifiedName of Object.keys(flattenedSourceGraph.typeAliases)) {
		const typeAlias = flattenedSourceGraph.typeAliases[qualifiedName];
		if (!typeAlias.allParents[LOADABLE_QUALIFIED_NAME])
			delete flattenedSourceGraph.typeAliases[qualifiedName];
	}

	for (const qualifiedName of Object.keys(flattenedSourceGraph.classes)) {
		const _class = flattenedSourceGraph.classes[qualifiedName];
		if (!_class.allParents[LOADABLE_QUALIFIED_NAME])
			delete flattenedSourceGraph.classes[qualifiedName];
	}

	for (const qualifiedName of Object.keys(flattenedSourceGraph.interfaces)) {
		const _interface = flattenedSourceGraph.interfaces[qualifiedName];
		if (!_interface.allParents[LOADABLE_QUALIFIED_NAME] && qualifiedName != LOADABLE_QUALIFIED_NAME)
			delete flattenedSourceGraph.interfaces[qualifiedName];
	}
}
