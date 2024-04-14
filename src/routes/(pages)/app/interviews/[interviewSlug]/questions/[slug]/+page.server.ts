import { db } from '$lib/db';
import { question, user, answer } from '$lib/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Answer } from '$lib/types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
	const slug = params.slug;
	const session = await locals.auth.validate();
	const userId = session?.user.userId;

	if (!userId) {
		error(401, 'Unauthorized');
	}

	const questionDetails = await db.query.question.findFirst({
		where: eq(question.slug, slug)
	});

	const answers = (await db.query.answer.findMany({
		with: {
			assessment: true
		},
		where: and(eq(answer.questionId, questionDetails!.id), eq(answer.userId, userId))
	})) as Answer[];

	return {
		questionDetails,
		answers
	};
}) satisfies PageServerLoad;
