import { db } from '$lib/db';
import { answer, interview, userInterview } from '$lib/db/schema';
import type { Interview, Question } from '$lib/types';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const session = await locals.auth.validate();
	const userId = session!.user.userId.toString();

	const interviewDetails = (await db.query.interview.findFirst({
		where: eq(interview.slug, params.slug),
		with: {
			questions: true
		}
	})) as Interview;

	const userInterviewDetails = await db.query.userInterview.findFirst({
		where: and(
			eq(userInterview.userId, userId),
			eq(userInterview.interviewId, interviewDetails.id)
		),
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

	let questions: Question[] = [];

	if (userInterviewDetails) questions = userInterviewDetails.interview.questions;
	else questions = interviewDetails.questions;

	return {
		interviewDetails,
		userInterviewDetails,
		questions
	};
}) satisfies PageServerLoad;
