import { TypeAliasDeclaration, VariableDeclaration } from 'typescript';
export declare type TypeAlias = {
    name: string;
    typeParameters: string[];
};
export declare type Type = {
    text: string;
    parentTypes: TypeAlias[];
};
export declare function parseType(declaration: VariableDeclaration | TypeAliasDeclaration): Type;
export declare function parseTypeAndParameters(expression: string): {
    name: string;
    typeParameters: string[];
};
