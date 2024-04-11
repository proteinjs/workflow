import { ClassDeclaration as ParserClassDeclaration, DeclarationVisibility } from 'typescript-parser';
import { ClassDeclaration, Property, Method, Visibility, InterfaceDeclaration } from '@proteinjs/reflection';
import { PackageNameFinder } from './PackageNameFinder';
import { createProperty } from './createProperty';
import { createMethod } from './createMethod';

export async function createClassDeclaration(parserClassDeclaration: ParserClassDeclaration, packageNameFinder: PackageNameFinder, filePath: string): Promise<ClassDeclaration> {
	let isAbstract = false;
	let isStatic = false;
	let visibility: Visibility = 'public';
	for (const accessor of parserClassDeclaration.accessors) {
		if (accessor.isAbstract)
			isAbstract = true;

		if (accessor.isStatic)
			isStatic = true;

		if (accessor.visibility)
			visibility = accessor.visibility == DeclarationVisibility.Protected ? 'protected' : 'public';
	}
	
	const properties: Property[] = [];
	for (const propertyDeclaration of parserClassDeclaration.properties)
		properties.push(await createProperty(propertyDeclaration, packageNameFinder));

	const methods: Method[] = [];
	for (const methodDeclaration of parserClassDeclaration.methods)
		methods.push(await createMethod(methodDeclaration, packageNameFinder));

	const typeParameters: string[] = [];
	if (parserClassDeclaration.typeParameters) {
		for (const typeParameter of parserClassDeclaration.typeParameters)
			typeParameters.push(`${await packageNameFinder.getPackageName(typeParameter)}/${typeParameter}`);
	}

	const directParentInterfaces: InterfaceDeclaration[] = [];
	for (const parentInterface of parserClassDeclaration.implements) {
		const parsedInterfaceNames = parentInterface.name.split(',').map(name => name.trim());
		for (let parentInterfaceName of parsedInterfaceNames) {
			const typeParameters: string[] = [];
			for (const typeParameter of parentInterface.typeParameters)
				typeParameters.push(`${await packageNameFinder.getPackageName(typeParameter)}/${typeParameter}`);

			const packageName = await packageNameFinder.getPackageName(parentInterfaceName);
			directParentInterfaces.push(new InterfaceDeclaration(packageName, parentInterfaceName, [], [], typeParameters, []));
		}
	}

	const directParentClasses: ClassDeclaration[] = [];
	for (const parentClass of parserClassDeclaration.extends) {
		const typeParameters: string[] = [];
		for (const typeParameter of parentClass.typeParameters)
			typeParameters.push(`${await packageNameFinder.getPackageName(typeParameter)}/${typeParameter}`);

		const packageName = await packageNameFinder.getPackageName(parentClass.name);
		directParentClasses.push(new ClassDeclaration(packageName, parentClass.name, false, false, 'public', [], [], typeParameters, [], []));
	}

	return new ClassDeclaration(packageNameFinder.referencingPackage, parserClassDeclaration.name, isAbstract, isStatic, visibility, properties, methods, typeParameters, directParentInterfaces, directParentClasses, filePath);
}