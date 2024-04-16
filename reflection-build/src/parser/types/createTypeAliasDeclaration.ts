import { TypeAliasDeclaration } from '@proteinjs/reflection';
import { TypeAliasDeclaration as ParserTypeAliasDeclaration, TypeAlias as ParserTypeAlias } from 'typescript-parser';
import { PackageNameFinder } from './PackageNameFinder';

export async function createTypeAliasDeclaration(parserTypeAliasDeclaration: ParserTypeAliasDeclaration, packageNameFinder: PackageNameFinder, filePath: string): Promise<TypeAliasDeclaration> {
	const parameters = await qualifyNames(parserTypeAliasDeclaration.typeParameters, packageNameFinder);
	const directParentTypeAliases = await typeAliasDeclarationsFromParserTypeAliases(parserTypeAliasDeclaration.type.parentTypes, packageNameFinder);
	return new TypeAliasDeclaration(packageNameFinder.referencingPackage, parserTypeAliasDeclaration.name, parameters, directParentTypeAliases, filePath);
}

export async function typeAliasDeclarationsFromParserTypeAliases(parserTypeAliasDeclarations: ParserTypeAlias[], packageNameFinder: PackageNameFinder): Promise<TypeAliasDeclaration[]> {
	const types: TypeAliasDeclaration[] = [];
	for (const typeAlias of parserTypeAliasDeclarations)
		types.push(await typeAliasDeclarationFromParserTypeAlias(typeAlias, packageNameFinder));
	return types;
}

export async function typeAliasDeclarationFromParserTypeAlias(parserTypeAlias: ParserTypeAlias, packageNameFinder: PackageNameFinder): Promise<TypeAliasDeclaration> {
	const typeAliasPackageName = await packageNameFinder.getPackageName(parserTypeAlias.name);
	const typeAliasParameters = await qualifyNames(parserTypeAlias.typeParameters, packageNameFinder);
	return new TypeAliasDeclaration(typeAliasPackageName, parserTypeAlias.name, typeAliasParameters);
}

export async function typeAliasDeclarationsFromNames(typeNames: string[], packageNameFinder: PackageNameFinder): Promise<TypeAliasDeclaration[]> {
	const typeAliasDeclarations: TypeAliasDeclaration[] = [];
	for (const typeName of typeNames)
		typeAliasDeclarations.push(await typeAliasDeclarationFromName(typeName, packageNameFinder));
	return typeAliasDeclarations;
}

export async function typeAliasDeclarationFromName(typeName: string, packageNameFinder: PackageNameFinder): Promise<TypeAliasDeclaration> {
	const typeAliasPackageName = await packageNameFinder.getPackageName(typeName);
	return new TypeAliasDeclaration(typeAliasPackageName, typeName);
}

async function qualifyNames(typeNames: string[], packageNameFinder: PackageNameFinder): Promise<string[]> {
	const qualifiedNames: string[] = [];
	for (const typeName of typeNames)
		qualifiedNames.push(`${await packageNameFinder.getPackageName(typeName)}/${typeName}`);
	return qualifiedNames;
}