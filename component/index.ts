import path from 'path';
import { CodegenConversation } from '@brentbahry/conversation';

(async () => {
  const repoPath = path.join(process.cwd(), '../..');
  await new CodegenConversation(repoPath).start();
})()

// 166 tokens to store the Sentence file content