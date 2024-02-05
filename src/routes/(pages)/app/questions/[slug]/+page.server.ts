import { db } from '$lib/db';
import { answer, question } from '$lib/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
	const slug = params.slug;
	const session = await locals.auth.validate();
	const userId = session!.user.userId.toString();

	const res = await db.query.question.findFirst({
		where: eq(question.slug, slug)
	});

	const answers = await db.query.answer.findMany({
		where: and(eq(question.id, res!.id), eq(answer.userId, userId))
	});

	return {
		question: res?.question,
		answers: answers
	};
}) satisfies PageServerLoad;
