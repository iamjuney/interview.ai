import { db } from '$lib/db';
import { answer, interview, userInterview } from '$lib/db/schema';
import type { Answer, Interview } from '$lib/types';
import { error } from '@sveltejs/kit';
import { eq, notInArray, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

// Function to convert the duration of the answers to a readable format (ex. 1hrs 3m 45s)
function readableDuration(duration: number) {
	const hours = Math.floor(duration / 3600);
	const minutes = Math.floor((duration % 3600) / 60);
	const seconds = duration % 60;
	return (
		`${hours ? `${hours} h` : ''} ${minutes ? `${minutes} m` : ''} ${seconds ? `${seconds} s` : ''}`.trim() ||
		'0 s'
	);
}

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
	for (let i = 0; i < userInterviews.length; i++) {
		if (userInterviews[i].status === 'completed') {
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

	for (let i = 0; i < userInterviews.length; i++) {
		for (let j = 0; j < userInterviews[i].interview.questions.length; j++) {
			if (userInterviews[i].interview.questions[j].answers.length > 0) {
				totalQuestionsAnswered++;

				for (let k = 0; k < userInterviews[i].interview.questions[j].answers.length; k++) {
					totalAnswerDuration += userInterviews[i].interview.questions[j].answers[k].duration;
				}
			}
		}
	}

	const averageAnswerDuration = readableDuration(totalAnswerDuration);

	return {
		suggestedInterviews,
		completed,
		in_progress,
		totalQuestionsAnswered,
		averageAnswerDuration
	};
}) satisfies PageServerLoad;
