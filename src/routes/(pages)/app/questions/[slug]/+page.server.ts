import { db } from '$lib/db';
import { question, user, answer } from '$lib/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const slug = params.slug;
	const session = await locals.auth.validate();
	const userId = session!.user.userId;

	const questionDetails = await db.query.question.findFirst({
		where: eq(question.slug, slug)
	});

	const answers = await db.query.answer.findMany({
		with: {
			assessment: true
		},
		where: and(eq(answer.questionId, questionDetails!.id), eq(answer.userId, userId))
	});

	return {
		questionDetails,
		answers
	};
}) satisfies PageServerLoad;
