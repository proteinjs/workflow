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
export class TypeAliasDeclaration implements ExportableDeclaration {
    constructor(
        public name: string,
		public isExported: boolean,
		public typeParameters: string[],
		public type: Type,
        public start?: number,
        public end?: number,
    ) { }
}
