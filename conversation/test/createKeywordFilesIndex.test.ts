import { createKeywordFilesIndex } from '../src/createKeywordFilesIndex';

test('Create keyword-files index', async() => {
  // Example usage
  const index = await createKeywordFilesIndex(`${process.cwd()}`);
  console.log(JSON.stringify(index, null, 2));
}, 60000)