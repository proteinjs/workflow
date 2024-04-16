export abstract class PackageScope {
	public readonly qualifiedName: string;

	constructor(
		public readonly packageName: string,
		public readonly name: string,
		public readonly filePath?: string
	) {
		this.qualifiedName = `${packageName}/${name}`;
	}
}

export class Variable extends PackageScope {
	constructor(
		packageName: string,
		name: string,
		filePath: string,
		public readonly isExported: boolean,
		public readonly isConst: boolean,
		public readonly value: any,
		public readonly typeParameters: {[qualifiedName: string]: (TypeAlias|Interface)[]} = {},
		public directParentTypes: {[qualifiedName: string]: TypeAlias|Interface} = {},
		public allParentTypes: {[qualifiedName: string]: TypeAlias|Interface} = {},
		public rootParentTypes: {[qualifiedName: string]: TypeAlias|Interface} = {}
	) {
		super(packageName, name, filePath);
	}
}

export class TypeAlias extends PackageScope {
	constructor(
		packageName: string,
		name: string,
		filePath?: string,
		public readonly typeParameters: {[qualifiedName: string]: (TypeAlias|Interface)[]} = {},
		public readonly directParents: {[qualifiedName: string]: TypeAlias|Interface} = {},
		public allParents: {[qualifiedName: string]: TypeAlias|Interface} = {},
		public rootParents: {[qualifiedName: string]: TypeAlias|Interface} = {},
		public directChildren: {[qualifiedName: string]: TypeAlias|Variable} = {},
		public allChildren: {[qualifiedName: string]: TypeAlias|Variable} = {},
		public baseChildren: {[qualifiedName: string]: TypeAlias|Variable} = {}
	) {
		super(packageName, name, filePath);
	}
}

export class Class extends PackageScope {
	constructor(
		packageName: string,
		name: string,
		filePath: string,
		public readonly isAbstract: boolean,
		public readonly isStatic: boolean,
		public readonly visibility: Visibility,
		public readonly properties: Property[],
		public readonly methods: Method[],
		public readonly _constructor: any,
		public readonly directParents: {[qualifiedName: string]: Class|Interface|TypeAlias} = {},
		public readonly typeParameters: {[qualifiedName: string]: (TypeAlias|Interface|TypeAlias)[]} = {},
		public allParents: {[qualifiedName: string]: Class|Interface|TypeAlias} = {},
		public rootParents: {[qualifiedName: string]: Class|Interface|TypeAlias} = {},
		public directChildren: {[qualifiedName: string]: Class} = {},
		public allChildren: {[qualifiedName: string]: Class} = {},
		public baseChildren: {[qualifiedName: string]: Class} = {}
	) {
		super(packageName, name, filePath);
	}
}

export class Interface extends PackageScope {
	constructor(
		packageName: string,
		name: string,
		public readonly properties: Property[],
		public readonly methods: Method[],
		filePath?: string,
		public readonly typeParameters: {[qualifiedName: string]: (TypeAlias|Interface)[]} = {},
		public readonly directParents: {[qualifiedName: string]: Interface|TypeAlias} = {},
		public allParents: {[qualifiedName: string]: Interface|TypeAlias} = {},
		public rootParents: {[qualifiedName: string]: Interface|TypeAlias} = {},
		public readonly directChildren: {[qualifiedName: string]: Interface|TypeAlias|Class|Variable} = {},
		public allChildren: {[qualifiedName: string]: Interface|TypeAlias|Class|Variable} = {},
		public baseChildren: {[qualifiedName: string]: Interface|TypeAlias|Class|Variable} = {}
	) {
		super(packageName, name, filePath);
	}
}

export class Method {
	constructor(
		public readonly name: string,
		public readonly returnType: TypeAliasDeclaration|undefined,
		public readonly isAsync: boolean,
		public readonly isOptional: boolean,
		public readonly isAbstract: boolean,
		public readonly isStatic: boolean,
		public readonly visibility: Visibility,
		public readonly parameters: Parameter[],
		// public readonly variables: VariableDeclaration[]
	) {}
}

export type Visibility = 'public'|'protected'|'private'|undefined;

export class Property {
	constructor(
		public readonly name: string,
		public readonly type: TypeAliasDeclaration|undefined,
		public readonly isOptional: boolean,
		public readonly isAbstract: boolean,
		public readonly isStatic: boolean,
		public readonly visibility: Visibility
	) {}
}

export class Parameter {
	constructor(
		public readonly name: string,
		public readonly type: TypeAliasDeclaration|undefined,
		// public readonly isOptional: boolean
	) {}
}


/**
 * Declarations are intermediary types created by the parser. They do not contain the deeply-nested, relational
 * information possible at runtime. 
 * 
 * Note: The declaration types specified in typescript-parser are not used because they are not package-scoped.
 * The typescript-parser package is a file-level parser, and reflection is a package-level parser.
 */

export class VariableDeclaration extends PackageScope {
	constructor(
		packageName: string,
		name: string,
		filePath: string,
		public type: TypeAliasDeclaration,
		public isExported: boolean,
		public isConst: boolean
	) {
		super(packageName, name, filePath);
	}

	static deserialize(json: any): VariableDeclaration {
		return new VariableDeclaration(json.packageName, json.name, json.filePath, json.type, json.isExported, json.isConst);
	}
}

export class TypeAliasDeclaration extends PackageScope {
	constructor(
		packageName: string,
		name: string,
		public typeParameters?: string[],
		public directParents?: TypeAliasDeclaration[],
		filePath?: string
	) {
		super(packageName, name, filePath);
	}

	static deserialize(json: any): TypeAliasDeclaration {
		return new TypeAliasDeclaration(json.packageName, json.name, json.typeParameters, json.directParents, json.filePath);
	}
}

export class ClassDeclaration extends PackageScope {
	constructor(
		packageName: string,
		name: string,
		public readonly isAbstract: boolean,
		public readonly isStatic: boolean,
		public readonly visibility: Visibility,
		public readonly properties: Property[],
		public readonly methods: Method[],
		public readonly typeParameters: string[],
		public readonly directParentInterfaces: InterfaceDeclaration[],
		public readonly directParentClasses: ClassDeclaration[],
		filePath?: string
	) {
		super(packageName, name, filePath);
	}

	static deserialize(json: any): ClassDeclaration {
		return new ClassDeclaration(json.packageName, json.name, json.isAbstract, json.isStatic, json.visibility, json.properties, json.methods, json.typeParameters, json.directParentInterfaces, json.directParentClasses, json.filePath);
	}
}

export class InterfaceDeclaration extends PackageScope {
	constructor(
		packageName: string,
		name: string,
		public readonly properties: Property[],
		public readonly methods: Method[],
		public readonly typeParameters: string[],
		public readonly directParents: InterfaceDeclaration[],
		filePath?: string
	) {
		super(packageName, name, filePath);
	}

	static deserialize(json: any): InterfaceDeclaration {
		return new InterfaceDeclaration(json.packageName, json.name, json.properties, json.methods, json.typeParameters, json.directParents, json.filePath);
	}
}