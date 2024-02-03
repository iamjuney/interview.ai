import { db } from './index';
import { interview } from './schema';

async function cleanupDatabase() {
	await db.delete(interview);
}

cleanupDatabase()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		console.log('Cleaning database done!');
		process.exit(0);
	});
