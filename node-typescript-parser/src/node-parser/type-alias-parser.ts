import { TypeAliasDeclaration } from 'typescript';

import { TypeAliasDeclaration as TshType } from '../declarations/TypeAliasDeclaration';
import { Resource } from '../resources/Resource';
import { isNodeExported } from './parse-utilities';
import { parseType } from './changes/parseType';

/**
 * Parses a type alias into the declaration.
 *
 * @export
 * @param {Resource} resource
 * @param {TypeAliasDeclaration} node
 */
export function parseTypeAlias(resource: Resource, node: TypeAliasDeclaration): void {
	let typeParameters: string[] = [];
	if (node.typeParameters)
		typeParameters = node.typeParameters.map(param => param.getText());
		
    resource.declarations.push(
        new TshType(node.name.text, isNodeExported(node), typeParameters, parseType(node), node.getStart(), node.getEnd()),
    );
}
