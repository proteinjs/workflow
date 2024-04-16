import { PropertyDeclaration, DeclarationVisibility } from 'typescript-parser';
import { Property } from '@proteinjs/reflection';
import { PackageNameFinder } from './PackageNameFinder';
import { typeAliasDeclarationFromName } from './createTypeAliasDeclaration';

export async function createProperty(propertyDeclaration: PropertyDeclaration, packageNameFinder: PackageNameFinder): Promise<Property> {
	const typeAliasDeclaration = propertyDeclaration.type ? await typeAliasDeclarationFromName(propertyDeclaration.type, packageNameFinder) : undefined;
	const visibility = propertyDeclaration.visibility == DeclarationVisibility.Private ? 'private' : propertyDeclaration.visibility == DeclarationVisibility.Protected ? 'protected' : 'public';
	return new Property(propertyDeclaration.name, typeAliasDeclaration, propertyDeclaration.isOptional, false, propertyDeclaration.isStatic, visibility);
}