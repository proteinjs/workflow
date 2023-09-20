import { ExportableDeclaration, TypedDeclaration } from './Declaration';
import { Type } from '../node-parser/changes/parseType';
/**
 * Variable declaration. Is contained in a method or function, or can be exported.
 *
 * @export
 * @class VariableDeclaration
 * @implements {ExportableDeclaration}
 * @implements {TypedDeclaration}
 */
export declare class VariableDeclaration implements ExportableDeclaration, TypedDeclaration {
    name: string;
    isConst: boolean;
    isExported: boolean;
    type: Type;
    start?: number | undefined;
    end?: number | undefined;
    constructor(name: string, isConst: boolean, isExported: boolean, type: Type, start?: number | undefined, end?: number | undefined);
}
