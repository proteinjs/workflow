"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTypeAndParameters = exports.parseType = void 0;
function parseType(declaration) {
    const typeText = declaration.type ? declaration.type.getText() : null;
    if (!typeText)
        return { text: '', parentTypes: [] };
    const serializedChildTypes = typeText.split('&');
    const parentTypes = [];
    for (const serializedChildType of serializedChildTypes) {
        let name = serializedChildType.trim();
        let typeParameters = [];
        if (name.startsWith('{')) {
            parentTypes.push({ name, typeParameters });
            continue;
        }
        parentTypes.push(parseTypeAndParameters(name));
    }
    return { text: typeText, parentTypes: parentTypes };
}
exports.parseType = parseType;
function parseTypeAndParameters(expression) {
    let name = expression.trim();
    let typeParameters = [];
    if (name.includes('<')) {
        typeParameters = parseTypeParameters(name);
        name = name.slice(0, name.indexOf('<'));
    }
    return { name, typeParameters };
}
exports.parseTypeAndParameters = parseTypeAndParameters;
function parseTypeParameters(typeParameterExpression) {
    let serialiedTypeParameters = typeParameterExpression.slice(typeParameterExpression.indexOf('<') + 1, typeParameterExpression.length - 1);
    return serialiedTypeParameters.split(',').map((typeParameter) => typeParameter.trim());
}
