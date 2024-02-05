import { db } from '$lib/db';
import type { Interview } from '$lib/types';
import type { PageServerLoad } from './$types';
import { sql } from 'drizzle-orm';

export const load = (async () => {

    // This is a query to the database to get a random interview with its questions
	const interviews = (await db.query.interview.findMany({
		with: {
			questions: true
		},
        limit: 2,
        orderBy: sql`RANDOM()`,
        
	})) as Interview[];

	return {
		interviews
	};
}) satisfies PageServerLoad;
