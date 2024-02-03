import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load = (async () => {
	const interviews = await db.query.interview.findMany({
		with: {
			questions: true
		}
	});

	return {
		interviews
	};
}) satisfies PageServerLoad;
