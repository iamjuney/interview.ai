import { db } from '$lib/db';
import { answer, interview, userInterview } from '$lib/db/schema';
import type { Interview } from '$lib/types';
import { error } from '@sveltejs/kit';
import { eq, notInArray, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	const userId = session?.user.userId;

	if (!userId) {
		error(401, 'Unauthorized');
	}

	// Get count of completed interviews
	const userInterviews = await db.query.userInterview.findMany({
		where: eq(userInterview.userId, userId),
		with: {
			interview: {
				with: {
					questions: {
						with: {
							answers: {
								where: eq(answer.userId, userId)
							}
						}
					}
				}
			}
		}
	});

	if (userInterviews.length === 0) {
		const suggestedInterviews = await db.query.interview.findMany({
			with: {
				questions: true
			},
			limit: 3,
			orderBy: sql`RANDOM()`
		});

		return {
			suggestedInterviews: suggestedInterviews as Interview[],
			completed: 0,
			in_progress: 0,
			totalQuestionsAnswered: 0,
			averageAnswerDuration: 0
		};
	}

	// loop through the user interviews and get the completed ones
	let completed = 0;
	for (const userInterview of userInterviews) {
		if (userInterview.status === 'completed') {
			completed++;
		}
	}

	const in_progress = userInterviews.length - completed;

	// This is a query to the database to get a random interview with its questions
	const suggestedInterviews = (await db.query.interview.findMany({
		where: notInArray(
			interview.id,
			userInterviews.map((ui) => ui.interviewId)
		),
		with: {
			questions: true
		},
		limit: 3,
		orderBy: sql`RANDOM()`
	})) as Interview[];

	let totalQuestionsAnswered = 0;
	let totalAnswerDuration = 0;
	let totalAnswers = 0;

	for (const userInterview of userInterviews) {
		for (const question of userInterview.interview.questions) {
			if (question.answers.length > 0) {
				totalQuestionsAnswered++;

				for (const answer of question.answers) {
					totalAnswers++;
					totalAnswerDuration += answer.duration;
				}
			}
		}
	}

	const averageAnswerDuration = readableDuration(totalAnswerDuration / totalAnswers);

	return {
		suggestedInterviews,
		completed,
		in_progress,
		totalQuestionsAnswered,
		averageAnswerDuration
	};
}) satisfies PageServerLoad;

const readableDuration = (duration: number) => {
	const minutes = Math.floor((duration % 3600) / 60);
	const seconds = duration % 60;
	return ((minutes ? minutes + ' m ' : '') + (seconds ? seconds + ' s' : '')).trim() || '0 s';
};
