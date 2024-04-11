import * as graphlib from '@dagrejs/graphlib';
import { VariableDeclaration as ParserVariableDeclaration, TypeAliasDeclaration as ParserTypeAliasDeclaration, ClassDeclaration as ParserClassDeclaration, InterfaceDeclaration as ParserInterfaceDeclaration, File } from 'typescript-parser';
import { TypeAliasDeclaration, SourceRelationship, SourceType } from '@proteinjs/reflection';
import { createVariableDeclaration } from './types/createVariableDeclaration';
import { PackageNameFinder } from './types/PackageNameFinder';
import { createTypeAliasDeclaration } from './types/createTypeAliasDeclaration';
import { createClassDeclaration } from './types/createClassDeclaration';
import { createInterfaceDeclaration } from './types/createInterfaceDeclaration';

export function createGraphBuilder(graph: graphlib.Graph, packageJson: any, packageJsonDir: string) {
	const packageName = packageJson.name;
	return async (parsedFile: File): Promise<void> => {
		for (const declaration of parsedFile.declarations) {
			if (!(declaration as any)['isExported'])
				continue;

			if (!declaration.name)
				continue;
				
			const packageNameFinder = new PackageNameFinder(parsedFile, packageJsonDir, packageName);
			if (declaration instanceof ParserVariableDeclaration) {
				const variableDeclaration = await createVariableDeclaration(declaration, packageNameFinder, parsedFile.filePath);
				graph.setNode(variableDeclaration.qualifiedName, Object.assign(variableDeclaration, { sourceType: SourceType.variable }));
				addTypeAliasDeclaration(variableDeclaration.type, variableDeclaration.qualifiedName, SourceRelationship.hasType, graph);
			} else if (declaration instanceof ParserTypeAliasDeclaration) {
				const typeAliasDeclaration = await createTypeAliasDeclaration(declaration, packageNameFinder, parsedFile.filePath);
				graph.setNode(typeAliasDeclaration.qualifiedName, Object.assign(typeAliasDeclaration, { sourceType: SourceType.typeAlias }));
				addTypeAliasDeclaration(typeAliasDeclaration, typeAliasDeclaration.qualifiedName, SourceRelationship.extendsType, graph);
			} else if (declaration instanceof ParserClassDeclaration) {
				const classDeclaration = await createClassDeclaration(declaration, packageNameFinder, parsedFile.filePath);
				graph.setNode(classDeclaration.qualifiedName, Object.assign(classDeclaration, { sourceType: SourceType.class }));
				for (const parentInterface of classDeclaration.directParentInterfaces) {
					if (parentInterface.packageName.startsWith('/'))
						continue;

					if (!graph.hasNode(parentInterface.qualifiedName))
						graph.setNode(parentInterface.qualifiedName);

					graph.setEdge(classDeclaration.qualifiedName, parentInterface.qualifiedName, SourceRelationship.implementsInterface);
				}

				for (const parentClass of classDeclaration.directParentClasses) {
					if (parentClass.packageName.startsWith('/'))
						continue;

					if (!graph.hasNode(parentClass.qualifiedName))
						graph.setNode(parentClass.qualifiedName);

					graph.setEdge(classDeclaration.qualifiedName, parentClass.qualifiedName, SourceRelationship.extendsClass);
				}
			} else if (declaration instanceof ParserInterfaceDeclaration) {
				const interfaceDeclaration = await createInterfaceDeclaration(declaration, packageNameFinder, parsedFile.filePath);
				graph.setNode(interfaceDeclaration.qualifiedName, Object.assign(interfaceDeclaration, { sourceType: SourceType.interface }));
				for (const parentInterface of interfaceDeclaration.directParents) {
					if (parentInterface.packageName.startsWith('/'))
						continue;

					if (!graph.hasNode(parentInterface.qualifiedName))
						graph.setNode(parentInterface.qualifiedName);

					graph.setEdge(interfaceDeclaration.qualifiedName, parentInterface.qualifiedName, SourceRelationship.extendsInterface);
				}
			}
		}
	};
}

function addTypeAliasDeclaration(typeAliasDeclaration: TypeAliasDeclaration, parentQualifiedName: string, sourceRelationship: SourceRelationship, graph: graphlib.Graph) {
	if (!typeAliasDeclaration.directParents)
		return;

	for (const parentType of typeAliasDeclaration.directParents) {
		if (parentType.name.startsWith('{'))
			continue;

		if (parentType.packageName.startsWith('/'))
			continue;

		if (!graph.hasNode(parentType.qualifiedName))
			graph.setNode(parentType.qualifiedName);

		graph.setEdge(parentQualifiedName, parentType.qualifiedName, sourceRelationship);
	}
}