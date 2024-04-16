import { TypeAliasDeclaration, VariableDeclaration } from 'typescript';

export type TypeAlias = {
	name: string,
	typeParameters: string[]
};

export type Type = { 
	text: string,
	parentTypes: TypeAlias[]
};

export function parseType(declaration: VariableDeclaration | TypeAliasDeclaration): Type {
	const typeText = declaration.type ? declaration.type.getText() : null;
	if (!typeText)
		return { text: '', parentTypes: [] };

	const serializedChildTypes = typeText.split('&');
	const parentTypes: Type['parentTypes'] = [];
	for (const serializedChildType of serializedChildTypes) {
		let name = serializedChildType.trim();
		let typeParameters: string[] = [];
		if (name.startsWith('{')) {
			parentTypes.push({ name, typeParameters });
			continue;
		}

		parentTypes.push(parseTypeAndParameters(name));
	}
	
	return { text: typeText, parentTypes: parentTypes };
}

export function parseTypeAndParameters(expression: string): { name: string, typeParameters: string[] } {
	let name = expression.trim();
	let typeParameters: string[] = [];
	if (name.includes('<')) {
		typeParameters = parseTypeParameters(name);
		name = name.slice(0, name.indexOf('<'));
	}

	return { name, typeParameters };
}

function parseTypeParameters(typeParameterExpression: string): string[] {
	let serialiedTypeParameters = typeParameterExpression.slice(typeParameterExpression.indexOf('<') + 1, typeParameterExpression.length - 1);
	return serialiedTypeParameters.split(',').map((typeParameter) => typeParameter.trim());
}