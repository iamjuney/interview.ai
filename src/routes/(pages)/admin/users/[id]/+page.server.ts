import { db } from '$lib/db';
import { answer, userInterview } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const userDetails = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, params.id)
	});

	if (!userDetails) {
		return error(404, 'User not found');
	}

	// Get count of completed interviews
	const userInterviews = await db.query.userInterview.findMany({
		where: eq(userInterview.userId, userDetails.id),
		with: {
			interview: {
				with: {
					questions: {
						with: {
							answers: {
								with: {
									assessment: true
								},
								where: eq(answer.userId, userDetails.id)
							}
						}
					}
				}
			}
		}
	});

	let completed = 0;
	let in_progress = 0;
	let totalQuestionsAnswered = 0;
	let totalAnswerDuration = 0;
	let averageAnswerDuration = '0 s';
	let totalAnswers = 0;

	// Calculate the completed interviews
	for (const userInterview of userInterviews) {
		if (userInterview.status === 'completed') {
			completed++;
		}
	}

	// Calculate the total questions answered
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

	in_progress = userInterviews.length - completed; // Calculate the in progress interviews
	averageAnswerDuration = readableDuration(totalAnswerDuration / totalAnswers); // Calculate the average answer duration

	return {
		userDetails,
		userInterviews,
		stats: {
			completed,
			in_progress,
			totalQuestionsAnswered,
			averageAnswerDuration
		}
	};
}) satisfies PageServerLoad;

const readableDuration = (duration: number) => {
	const minutes = Math.floor((duration % 3600) / 60);
	const seconds = duration % 60;
	return ((minutes ? minutes + ' m ' : '') + (seconds ? seconds + ' s' : '')).trim() || '0 s';
};
