import { db } from '$lib/db';
import { question } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Question } from '$lib/types';

export const load = (async ({ params }) => {
	const questionDetails = (await db.query.question.findFirst({
		where: eq(question.slug, params.slug)
	})) as Question;

	return {
		questionDetails
	};
}) satisfies PageServerLoad;
