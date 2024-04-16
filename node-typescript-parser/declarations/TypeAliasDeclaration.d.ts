import { ExportableDeclaration } from './Declaration';
import { Type } from '../node-parser/changes/parseType';
/**
 * Alias declaration that can be exported. Is used to defined types.
 * (e.g. type Foobar = { name: string };)
 *
 * @export
 * @class TypeAliasDeclaration
 * @implements {ExportableDeclaration}
 */
export declare class TypeAliasDeclaration implements ExportableDeclaration {
    name: string;
    isExported: boolean;
    typeParameters: string[];
    type: Type;
    start?: number | undefined;
    end?: number | undefined;
    constructor(name: string, isExported: boolean, typeParameters: string[], type: Type, start?: number | undefined, end?: number | undefined);
}
