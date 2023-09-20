import globby from 'globby';
import path from 'path';
import { Logger } from '@brentbahry/util';

/**
 * Create keyword-files index for the given base directory.
 * 
 * @param baseDir - The directory to start the file search from.
 * @returns An index with keywords mapped to file paths.
 */
export async function createKeywordFilesIndex(baseDir: string, globIgnorePatterns: string[] = []): Promise<{ [keyword: string]: string[] }> {
    const logger = new Logger('createKeywordFilesIndex');
    // Ensure the base directory has a trailing slash
    if (!baseDir.endsWith(path.sep)) {
        baseDir += path.sep;
    }

    // Get all file paths, recursively, excluding node_modules and dist directories
    const filePaths = await globby(baseDir + '**/*', {
        ignore: ['**/node_modules/**', '**/dist/**', ...globIgnorePatterns]
    });

    const keywordFilesIndex: { [keyword: string]: string[] } = {};

    // Process each file path
    for (const filePath of filePaths) {
        const fileName = path.parse(filePath).name; // Get file name without extension

        if (!keywordFilesIndex[fileName]) {
            keywordFilesIndex[fileName] = [];
        }
        
        logger.debug(`fileName: ${fileName}, filePath: ${filePath}`);
        keywordFilesIndex[fileName].push(filePath);
    }

    return keywordFilesIndex;
}
