import { db } from '$lib/db';
import { question, userInterview } from '$lib/db/schema';
import type { Question } from '$lib/types';
import { eq, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	const user = session!.user;

	// Get all user interviews and the interview details
	const all = await db.query.userInterview.findMany({
		columns: {
			interviewId: true
		},
		where: eq(userInterview.userId, user.userId)
	});

	let questions: Question[] = [];

	if (all.length > 0) {
		questions = await db.query.question.findMany({
			where: inArray(
				question.interviewId,
				all.map((i) => i.interviewId)
			)
		});
	} else {
		questions = [];
	}

	return {
		questions
	};
}) satisfies PageServerLoad;
