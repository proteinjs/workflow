// export * from './src/Component';
import path from 'path';
import { CodegenConversation, Repo, RepoFactory } from '@brentbahry/conversation';
import { Fs } from '@brentbahry/util';

(async () => {
  const p = path.join(process.cwd(), '..');
  const repo = await RepoFactory.createRepo(p);
  await new CodegenConversation(repo).start();
})()

// 166 tokens to store the Sentence file content