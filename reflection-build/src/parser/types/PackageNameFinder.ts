import * as path from 'path';
import { File as ParsedFile, NamedImport } from 'typescript-parser';
import { promisifiedFs } from '@proteinjs/util-node';

export class PackageNameFinder {
	private readonly symbolToLibraryMap: { [symbol: string]: string };
	private readonly symbolDeclaredInFileMap: { [symbol: string]: boolean };

	constructor(
		private readonly referencingFile: ParsedFile, 
		private readonly referencingPackageJsonDir: string, 
		public readonly referencingPackage: string
	) {
		this.symbolToLibraryMap = this.createSymbolToLibraryMap(referencingFile);
		this.symbolDeclaredInFileMap = this.createSymbolDeclaredInFileMap(referencingFile);
	}

	private createSymbolToLibraryMap(parsedFile: ParsedFile): { [symbol: string]: string } {
		const symbolToLibraryMap: {[type: string]: string} = {};
		for (const _import of parsedFile.imports) {
			if (!(_import instanceof NamedImport))  // TODO support all relevant import types
				continue;
	
			for (const specifier of _import.specifiers)
				symbolToLibraryMap[specifier.specifier] = _import.libraryName;
		}
	
		return symbolToLibraryMap;
	}

	private createSymbolDeclaredInFileMap(parsedFile: ParsedFile): { [symbol: string]: boolean } {
		const symbolToFileLocalLibraryMap: { [symbol: string]: boolean } = {};
		for (const declaration of parsedFile.declarations)
			symbolToFileLocalLibraryMap[declaration.name] = true;
		return symbolToFileLocalLibraryMap;
	}

	async getPackageName(symbolName: string): Promise<string> {
		if (symbolName.startsWith('{'))
			return this.referencingPackage;
	
		const relativePathFromSourceFileToPackageJson = path.relative(this.referencingFile.filePath, this.referencingPackageJsonDir);
		const relativeHeightOfPackageJson = this.maxDirHeight(relativePathFromSourceFileToPackageJson);
		let packageName = this.referencingPackage;
		const importLibrary = this.symbolToLibraryMap[symbolName];
		if (importLibrary) {
			if (importLibrary.startsWith('.')) {
				const relativeHeightOfImportLibrary = this.maxDirHeight(importLibrary);
				if (relativeHeightOfImportLibrary > relativeHeightOfPackageJson)
					packageName = await this.getLocalPackageName(importLibrary)
			} else {
				packageName = importLibrary;
			}
		} else if (!this.symbolDeclaredInFileMap[symbolName]) {
			packageName = '';  // global
		}
	
		return packageName;
	}
	
	private maxDirHeight(relativePath: string): number {
		const pathParts = relativePath.split(path.sep);
		let maxHeight = 0;
		for (let i = 0; i < pathParts.length; i++) {
			const currentPathPart = pathParts[i];
			if (currentPathPart == '..')
				maxHeight++;
	
			if (i > 1 && maxHeight == 0)
				return maxHeight;
	
			if (maxHeight > 0 && currentPathPart != '..')
				return maxHeight;
		}
	
		return maxHeight;
	}
	
	private async getLocalPackageName(sourceFilePath: string): Promise<string> {
		const sourceFilePathParts = sourceFilePath.split(path.sep);
		const lastPathPart = sourceFilePathParts.pop();
		if (lastPathPart && !lastPathPart.includes('.'))
			sourceFilePathParts.push(lastPathPart);
	
		while (sourceFilePathParts.length > 0) {
			const candidatePackagoJsonPath = path.join(sourceFilePathParts.join(path.sep), 'package.json');
			if (await promisifiedFs.exists(candidatePackagoJsonPath)) {
				const packageJson = require(candidatePackagoJsonPath);
				if (!packageJson.name)
					throw new Error(`Unable to package-qualify symbol declared in source file: ${sourceFilePath}, reason: package.json does not have name property: ${candidatePackagoJsonPath}`);
	
				return packageJson.name;
			} else {
				sourceFilePathParts.pop();
			}
		}
	
		throw new Error(`Unable to package-qualify symbol declared in source file: ${sourceFilePath}, reason: unable to find package.json for source file (must be in the same directory as file or a parent directory)`);
	}
}