import { db } from './index';
import { interview, user } from './schema';

async function cleanupDatabase() {
	await db.delete(interview);
	await db.delete(user);
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
