import { db } from '$lib/db';
import { interview } from '$lib/db/schema';
import type { Interview } from '$lib/types';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const res = (await db.query.interview.findFirst({
		where: eq(interview.slug, params.slug),
		with: {
			questions: true
		}
	})) as Interview;

	return {
		res
	};
}) satisfies PageServerLoad;
