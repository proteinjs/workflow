"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeAliasDeclaration = void 0;
/**
 * Alias declaration that can be exported. Is used to defined types.
 * (e.g. type Foobar = { name: string };)
 *
 * @export
 * @class TypeAliasDeclaration
 * @implements {ExportableDeclaration}
 */
class TypeAliasDeclaration {
    constructor(name, isExported, typeParameters, type, start, end) {
        this.name = name;
        this.isExported = isExported;
        this.typeParameters = typeParameters;
        this.type = type;
        this.start = start;
        this.end = end;
    }
}
exports.TypeAliasDeclaration = TypeAliasDeclaration;
