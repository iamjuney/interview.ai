import { db } from '$lib/db';
import { answer, userInterview } from '$lib/db/schema';
import type { Answer, Interview } from '$lib/types';
import { error } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

// Function to convert the duration of the answers to a readable format
function readableDuration(duration: number) {
	const hours = Math.floor(duration / 3600);
	const minutes = Math.floor((duration % 3600) / 60);
	return (
		`${hours ? `${hours} hour(s)` : ''} ${minutes ? `${minutes} min(s)` : ''}`.trim() || '0 min(s)'
	);
}

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	const userId = session?.user.userId;

	if (!userId) {
		error(401, 'Unauthorized');
	}

	// Get count of completed interviews
	const completed = await db.query.userInterview.findMany({
		where: and(eq(userInterview.userId, userId), eq(userInterview.status, 'completed'))
	});

	// This is a query to the database to get a random interview with its questions
	const interviews = (await db.query.interview.findMany({
		with: {
			questions: true
		},
		limit: 2,
		orderBy: sql`RANDOM()`
	})) as Interview[];

	// Get the duration of the answers
	const answers = (await db.query.answer.findMany({
		columns: {
			duration: true
		},
		with: {
			assessment: true
		},
		where: eq(answer.userId, userId)
	})) as Answer[];

	// Calculate the total duration of the answers
	const totalDuration = answers.reduce((acc, answer) => acc + answer.duration, 0);
	const interviewTime = readableDuration(totalDuration);

	return {
		interviews,
		completed,
		interviewTime
	};
}) satisfies PageServerLoad;
