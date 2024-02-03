import { db } from '$lib/db';
import type { Interview } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const interviews = (await db.query.interview.findMany({
		with: {
			questions: true
		}
	})) as Interview[];

	return {
		interviews
	};
}) satisfies PageServerLoad;
