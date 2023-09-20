import { Graph } from '@dagrejs/graphlib';
import { graphSerializer } from '@brentbahry/util';
import { SourceType } from './sourceGraphTypes';
import { VariableDeclaration, TypeAliasDeclaration, ClassDeclaration, InterfaceDeclaration, Class, Variable } from './types';
import { FlattenedSourceGraph, flattenSourceGraph } from './FlattenedSourceGraph';

export class SourceRepository {
	private static readonly INSTANCE = new SourceRepository();
	public readonly sourceGraph = new Graph();
	private readonly sourceLinks: { [qualifiedName: string]: any } = {};
	private _flattenedSourceGraph: FlattenedSourceGraph|undefined;
	// private readonly typeCache: { [type: string]: (ClassDeclaration|VariableDeclaration)[] } = {};
	private readonly objectCache: { [type: string]: any[] } = {};

	private constructor() {}

	static get(): SourceRepository {
		return SourceRepository.INSTANCE;
	}

	get flattenedSourceGraph(): FlattenedSourceGraph {
		if (!this._flattenedSourceGraph)
			this._flattenedSourceGraph = flattenSourceGraph(this.sourceGraph, this.sourceLinks);

		return this._flattenedSourceGraph;
	}

	/**
	 * Same as SourceRepository.objects except assumes it will find only 1 object.
	 * 
	 * @param extendingType a Type or Interface that the Class or Variable extends
	 * @return variable or instantiated class that extends `extendingType`
	 */
	object<T>(extendingType: string): T {
		return this.objects<T>(extendingType)[0];
	}

	/**
	 * @param extendingType a Type or Interface that the Class or Variable extends
	 * @return variables and instantiated classes that extend `extendingType`
	 */
	objects<T>(extendingType: string): T[] {
		if (this.objectCache[extendingType])
			return this.objectCache[extendingType];

		const _interface = SourceRepository.get().flattenedSourceGraph.interfaces[extendingType];
		let baseChildren: any;
		if (_interface)
			baseChildren = _interface.baseChildren;
		else {
			const typeAlias = SourceRepository.get().flattenedSourceGraph.typeAliases[extendingType];
			if (!typeAlias)
				throw new Error(`Unable to find type: ${extendingType}`);

			baseChildren = typeAlias.baseChildren;
		}

		const extendingObjects: T[] = [];
		for (const baseChildQualifiedName in baseChildren) {
			const child = baseChildren[baseChildQualifiedName];
			if (child instanceof Class)
				extendingObjects.push(new child._constructor());
			else if (child instanceof Variable)
				extendingObjects.push(child.value);
		}

		this.objectCache[extendingType] = extendingObjects;
		return extendingObjects;
	}

	static merge(serializedSourceGraph: string, sourceLinks: { [qualifiedName: string]: any }) {
		const unescapedSerializedSourceGraph = serializedSourceGraph.replace(/\\\'/g, "'");
		const sourceGraph = graphSerializer.deserialize(unescapedSerializedSourceGraph);
		for (const nodeName of sourceGraph.nodes()) {
			const nodeValue = sourceGraph.node(nodeName);
			if (!nodeValue)
				continue;

			SourceRepository.INSTANCE.sourceGraph.setNode(nodeName, SourceRepository.deserializeClass(nodeValue));
		}

		for (const edge of sourceGraph.edges()) {
			const edgeValue = sourceGraph.edge(edge);
			SourceRepository.INSTANCE.sourceGraph.setEdge(edge, edgeValue);
		}

		Object.assign(SourceRepository.INSTANCE.sourceLinks, sourceLinks);
	}

	private static deserializeClass(classJson: any): any {
		if (classJson.sourceType === SourceType.variable)
			return VariableDeclaration.deserialize(classJson);
		else if (classJson.sourceType === SourceType.typeAlias)
			return TypeAliasDeclaration.deserialize(classJson);
		else if (classJson.sourceType === SourceType.class)
			return ClassDeclaration.deserialize(classJson);
		else if (classJson.sourceType === SourceType.interface)
			return InterfaceDeclaration.deserialize(classJson);

		return classJson;
	}

	
	// objects<T>(type: string): T[] {
	// 	if (!this.objectCache[type]) {
	// 		this.objectCache[type] = this.types(type).map((type) => {
	// 			if (type instanceof VariableDeclaration)
	// 				return type.value;

	// 			if (type instanceof ClassDeclaration)
	// 				return new type._constructor();

	// 			return null;
	// 		});
	// 	}

	// 	return this.objectCache[type];
	// }

	// types(parentType: string): (ClassDeclaration|VariableDeclaration)[] {
	// 	if (!this.typeCache[parentType]) {
	// 		const node = this.sourceGraph.node(parentType);
	// 		if (!node)
	// 			throw new Error(`Failed to find types, reason: parent type does not exist: ${parentType}`);

	// 		const collectedTypes: (ClassDeclaration|VariableDeclaration)[] = [];
	// 		this.collectTypes(parentType, collectedTypes);
	// 		this.typeCache[parentType] = collectedTypes;
	// 	}

	// 	return this.typeCache[parentType];
	// }

	// private collectTypes(type: string, collectedTypes: (ClassDeclaration|VariableDeclaration)[]): void {
	// 	const childTypes = this.sourceGraph.successors(type);
	// 	if (!childTypes)
	// 		return;

	// 	for (const childType of childTypes) {
	// 		const childNode = this.sourceGraph.node(childType);
	// 		if (!childNode)
	// 			continue;

	// 		const sourceLink = this.sourceLinks[childNode.qualifiedName];
	// 		if (childNode instanceof VariableDeclaration) {
	// 			childNode.value = sourceLink;
	// 			collectedTypes.push(childNode);
	// 		} else if (childNode instanceof ClassDeclaration && !childNode.isAbstract) {
	// 			childNode._constructor = sourceLink;
	// 			collectedTypes.push(childNode);
	// 		}

	// 		this.collectTypes(childType, collectedTypes);
	// 	}
	// }
}