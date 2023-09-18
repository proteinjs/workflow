// export * from './src/Component';
import path from 'path';
import { CodegenConversation, RepoFactory } from '@brentbahry/conversation';

(async () => {
  const p = path.join(process.cwd(), '..');
  const repo = await RepoFactory.createRepo(p);
  console.log(`created repo`);
  // console.log(JSON.stringify(repo, null, 4));
  await new CodegenConversation(repo).start();
})()