import { ParameterDeclaration } from 'typescript-parser';
import { Parameter } from '@proteinjs/reflection';
import { PackageNameFinder } from './PackageNameFinder';
import { typeAliasDeclarationFromName } from './createTypeAliasDeclaration';

export async function createParameter(parameterDeclaration: ParameterDeclaration, packageNameFinder: PackageNameFinder): Promise<Parameter> {
	const typeAliasDeclaration = parameterDeclaration.type ? await typeAliasDeclarationFromName(parameterDeclaration.type, packageNameFinder) : undefined;
	return new Parameter(parameterDeclaration.name, typeAliasDeclaration);
}