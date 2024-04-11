import { DeclarationVisibility, MethodDeclaration } from 'typescript-parser';
import { Parameter, Method } from '@proteinjs/reflection';
import { PackageNameFinder } from './PackageNameFinder';
import { typeAliasDeclarationFromName } from './createTypeAliasDeclaration';
import { createParameter } from './createParameter';

export async function createMethod(methodDeclaration: MethodDeclaration, packageNameFinder: PackageNameFinder): Promise<Method> {
	const parameters: Parameter[] = [];
	for (const parameterDeclaration of methodDeclaration.parameters)
		parameters.push(await createParameter(parameterDeclaration, packageNameFinder));
	const returnType = methodDeclaration.type ? await typeAliasDeclarationFromName(methodDeclaration.type, packageNameFinder) : undefined;
	const visibility = methodDeclaration.visibility == DeclarationVisibility.Private ? 'private' : methodDeclaration.visibility == DeclarationVisibility.Protected ? 'protected' : 'public';
	return new Method(methodDeclaration.name, returnType, methodDeclaration.isAsync, methodDeclaration.isOptional, methodDeclaration.isAbstract, methodDeclaration.isStatic, visibility, parameters);
}