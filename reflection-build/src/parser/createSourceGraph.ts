import * as graphlib from '@dagrejs/graphlib';
import globby from 'globby';
import * as path from 'path';
import { TypescriptParser } from 'typescript-parser';
import { promisifiedFs } from '@proteinjs/util-node';
import { createGraphBuilder } from './createGraphBuilder';

export async function createSourceGraph(dir: string, excludedDirs: string[] = []) {
	const packageJsonPath = path.join(dir, 'package.json');
	if (!await promisifiedFs.exists(packageJsonPath))
		throw new Error(`Unable to find package.json in dir: ${dir}`);

	const packageJson = require(packageJsonPath);
	const sourceFilePaths = await globby([path.join(dir, 'src/**/*.ts'), path.join(dir, 'src/**/*.tsx'), '!**/node_modules/**'].concat(excludedDirs.map((dir) => `!${dir}`)));
	const graph = new graphlib.Graph();
	const addSourceFile = createGraphBuilder(graph, packageJson, dir);
	const parser = new TypescriptParser();
	for (const sourceFilePath of sourceFilePaths) {
		const sourceFile = await parser.parseFile(sourceFilePath, path.dirname(sourceFilePath));
		// console.log(`File imports (${sourceFile.filePath}): ${JSON.stringify(sourceFile.imports, null, 2)}`);
		await addSourceFile(sourceFile);
	}

	// for (const node of graph.nodes()) {
	// 	console.log(JSON.stringify(graph.node(node), null, 2));
	// }

	return graph;
}