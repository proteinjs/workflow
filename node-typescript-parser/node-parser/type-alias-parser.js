"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTypeAlias = void 0;
const TypeAliasDeclaration_1 = require("../declarations/TypeAliasDeclaration");
const parse_utilities_1 = require("./parse-utilities");
const parseType_1 = require("./changes/parseType");
/**
 * Parses a type alias into the declaration.
 *
 * @export
 * @param {Resource} resource
 * @param {TypeAliasDeclaration} node
 */
function parseTypeAlias(resource, node) {
    let typeParameters = [];
    if (node.typeParameters)
        typeParameters = node.typeParameters.map(param => param.getText());
    resource.declarations.push(new TypeAliasDeclaration_1.TypeAliasDeclaration(node.name.text, parse_utilities_1.isNodeExported(node), typeParameters, parseType_1.parseType(node), node.getStart(), node.getEnd()));
}
exports.parseTypeAlias = parseTypeAlias;
