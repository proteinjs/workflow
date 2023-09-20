export enum SourceType {
	variable,
	typeAlias,
	class,
	interface
};

export enum SourceRelationship {
	hasType = 'has type',
	extendsType = 'extends type',
	extendsClass = 'extends class',
	implementsInterface = 'implements interface',
	extendsInterface = 'extends interface'
};