import * as path from 'path';
const tsconfig = require('./tsconfigTemplate.json');
import { promisifiedFs } from '@proteinjs/util-node';
import { writeGeneratedIndex } from './codegen/writeGeneratedIndex';

export async function build() {
	const targetDir = process.env.INIT_CWD as string;
	const targetDirTsconfig = path.join(targetDir, 'tsconfig.json');
	const targetDirGenerated = path.join(targetDir, 'generated');
	const generatedIndex = path.join(targetDirGenerated, 'index.ts');
	await updatePackageJson();
	await writeTsconfig();
	await writeGeneratedIndex(targetDir, targetDirGenerated, generatedIndex);

	// TODO save their index location in package.json and pass it in to writeGeneratedIndex above
	async function updatePackageJson() {
		const targetDirPackageJson = path.join(targetDir, 'package.json');
		if (!await promisifiedFs.exists(targetDirPackageJson))
			throw new Error(`package.json does not exist, run \`npm init -y\` to create one`);

		const targetPackageJson = require(targetDirPackageJson);
		const targetDirDist = path.join(targetDir, 'dist');
		const targetDirDistGenerated = path.join(targetDirDist, 'generated');
		const generatedIndexJs = path.join(targetDirDistGenerated, 'index.js');
		const generatedIndexDts = path.join(targetDirDistGenerated, 'index.d.ts');
		targetPackageJson.main = `./${path.relative(targetDir, generatedIndexJs)}`;
		targetPackageJson.types = `./${path.relative(targetDir, generatedIndexDts)}`;
		await promisifiedFs.writeFile(targetDirPackageJson, JSON.stringify(targetPackageJson, null, 4));
	}

	async function writeTsconfig() {
		if (await promisifiedFs.exists(targetDirTsconfig)) {
			const existingTsconfig = require(targetDirTsconfig);
			if (existingTsconfig.include && !existingTsconfig.include.includes(`./${path.relative(targetDir, generatedIndex)}`)) {
				existingTsconfig.include.push(`./${path.relative(targetDir, generatedIndex)}`);
				await promisifiedFs.writeFile(targetDirTsconfig, JSON.stringify(existingTsconfig, null, 4));
			}
		} else {
			let generatedTsconfig = Object.assign({}, tsconfig);
			generatedTsconfig.include = [`./${path.relative(targetDir, generatedIndex)}`];
			await promisifiedFs.writeFile(targetDirTsconfig, JSON.stringify(generatedTsconfig, null, 4));
		}
	}
}