import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import { interview } from '$lib/db/schema';
import type { Question } from '$lib/types';

export const load = (async ({ params }) => {
	const res = await db.query.interview.findFirst({
		where: eq(interview.slug, params.slug),
		with: {
			questions: true
		}
	});

	return {
		res
	};
}) satisfies PageServerLoad;
