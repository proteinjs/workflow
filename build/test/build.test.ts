import { buildRepo } from '../src/buildRepo'

test('test buildRepo', async () => {
	await buildRepo();
}, 5 * 60 * 1000);