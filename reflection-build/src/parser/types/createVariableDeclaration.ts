import { VariableDeclaration, TypeAliasDeclaration } from '@proteinjs/reflection';
import { VariableDeclaration as ParserVariableDeclaration } from 'typescript-parser';
import { PackageNameFinder } from './PackageNameFinder';
import { typeAliasDeclarationsFromParserTypeAliases } from './createTypeAliasDeclaration';

export async function createVariableDeclaration(parserVariableDeclaration: ParserVariableDeclaration, packageNameFinder: PackageNameFinder, filePath: string): Promise<VariableDeclaration> {
	const typePackageName = await packageNameFinder.getPackageName(parserVariableDeclaration.type.text);
	const directParentTypeAliases = await typeAliasDeclarationsFromParserTypeAliases(parserVariableDeclaration.type.parentTypes, packageNameFinder);
	const typeAliasDeclaration = new TypeAliasDeclaration(typePackageName, parserVariableDeclaration.type.text, [], directParentTypeAliases);
	return new VariableDeclaration(packageNameFinder.referencingPackage, parserVariableDeclaration.name, filePath, typeAliasDeclaration, parserVariableDeclaration.isExported, parserVariableDeclaration.isConst);
}