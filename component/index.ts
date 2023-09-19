// export * from './src/Component';
import path from 'path';
import { CodegenConversation, Repo, RepoFactory } from '@brentbahry/conversation';
import { Fs } from '@brentbahry/util';

(async () => {
  const p = path.join(process.cwd(), '../conversation');
  // const repo = new Repo({
  //   packages: {},
  //   slimPackages: {},
  //   tsFiles: {},
  //   keywordFilesIndex: {},
  // });
  const repo = await RepoFactory.createRepo(p);
  // console.log(JSON.stringify(repo.keywordFilesIndex(), null, 4));
  await new CodegenConversation(repo).start();

  // const file = "/Users/brentbahry/repos/components/conversation/src/Code.ts";
  // console.log(await Fs.readFiles({ filePaths: [file] }));
})()