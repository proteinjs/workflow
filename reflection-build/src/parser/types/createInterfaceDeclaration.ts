import { InterfaceDeclaration as ParserInterfaceDeclaration } from 'typescript-parser';
import { InterfaceDeclaration, Property, Method } from '@proteinjs/reflection';
import { PackageNameFinder } from './PackageNameFinder';
import { createProperty } from './createProperty';
import { createMethod } from './createMethod';

export async function createInterfaceDeclaration(parserInterfaceDeclaration: ParserInterfaceDeclaration, packageNameFinder: PackageNameFinder, filePath: string): Promise<InterfaceDeclaration> {
	const properties: Property[] = [];
	for (const propertyDeclaration of parserInterfaceDeclaration.properties)
		properties.push(await createProperty(propertyDeclaration, packageNameFinder));

	const methods: Method[] = [];
	for (const methodDeclaration of parserInterfaceDeclaration.methods)
		methods.push(await createMethod(methodDeclaration, packageNameFinder));

	const parameters: string[] = [];
	if (parserInterfaceDeclaration.typeParameters) {
		for (const typeParameter of parserInterfaceDeclaration.typeParameters)
			parameters.push(`${await packageNameFinder.getPackageName(typeParameter)}/${typeParameter}`);
	}

	const directParents: InterfaceDeclaration[] = [];
	for (const parentInterface of parserInterfaceDeclaration.extends) {
		const typeParameters: string[] = [];
		for (const typeParameter of parentInterface.typeParameters)
			typeParameters.push(`${await packageNameFinder.getPackageName(typeParameter)}/${typeParameter}`);

		const packageName = await packageNameFinder.getPackageName(parentInterface.name);
		directParents.push(new InterfaceDeclaration(packageName, parentInterface.name, [], [], typeParameters, []));
	}

	return new InterfaceDeclaration(packageNameFinder.referencingPackage, parserInterfaceDeclaration.name, properties, methods, parameters, directParents, filePath);
}