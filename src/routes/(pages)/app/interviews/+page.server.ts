import { db } from '$lib/db';
import { answer, log, question, userInterview } from '$lib/db/schema';
import type { UserInterview } from '$lib/types';
import { error, fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { PageServerLoad } from './$types';

// Check if all questions in an interview have been answered
function checkInterviews(interviews: UserInterview[]) {
	return interviews.map((interview) => {
		const answered = interview.interview?.questions.every((question) =>
			question?.answers?.some((answer) => answer.userId === interview.userId)
		);
		return {
			id: interview.id,
			answered
		};
	});
}

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	const userId = session?.user.userId;

	if (!userId) {
		error(401, 'Unauthorized');
	}

	// Get all user interviews and the interview details
	const all = await db.query.userInterview.findMany({
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
		},
		where: eq(userInterview.userId, userId)
	});

	// filter where status is in-progress
	const in_progress = all.filter((interview) => interview.status === 'in-progress');

	// filter where status is completed
	const completed = all.filter((interview) => interview.status === 'completed');

	// Check if all questions in an interview have been answered
	const interviews = checkInterviews(all);

	// loop through all interviews and update the status
	for (const interview of interviews) {
		await db
			.update(userInterview)
			.set({
				status: interview.answered ? 'completed' : 'in-progress'
			})
			.where(eq(userInterview.id, interview.id));
	}

	return { all, in_progress, completed };
}) satisfies PageServerLoad;

export const actions = {
	add: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		const userId = session?.user.userId;

		if (!userId) {
			error(401, 'Unauthorized');
		}

		// Get the interview id and slug from the form data
		const form = await request.formData();
		const interviewId = form.get('interview_id')!.toString();

		try {
			// Insert the new interview into the userInterview table
			await db.insert(userInterview).values({
				id: uuidv4(),
				userId,
				interviewId
			});

			await db.insert(log).values({
				id: uuidv4(),
				userId: userId,
				message: 'User added interview'
			});
		} catch (error) {
			return fail(500, {
				message: 'Failed to add interview'
			});
		}

		redirect(302, `/app/interviews`);
	},

	delete: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		const userId = session?.user.userId;

		if (!userId) {
			error(401, 'Unauthorized');
		}

		const form = await request.formData();
		const userInterviewId = form.get('user_interview_id')!.toString();

		try {
			const interviewIdQuery = await db.query.userInterview.findFirst({
				columns: {
					interviewId: true
				},
				where: eq(userInterview.id, userInterviewId)
			});

			if (!interviewIdQuery) {
				return fail(500, {
					message: 'Failed to delete interview'
				});
			}

			// get all question ids associated with the interview
			const questions = await db.query.question.findMany({
				columns: {
					id: true
				},
				where: eq(question.interviewId, interviewIdQuery.interviewId)
			});

			// delete all answers associated with the interview
			for (const q of questions) {
				if (!q.id) {
					continue;
				}
				await db.delete(answer).where(and(eq(answer.questionId, q.id), eq(answer.userId, userId)));
			}

			// delete the interview
			await db.delete(userInterview).where(eq(userInterview.id, userInterviewId));

			await db.insert(log).values({
				id: uuidv4(),
				userId: userId,
				message: 'User deleted interview'
			});

			// TODO: delete all videos and answers associated with the interview
		} catch (error) {
			return fail(500, {
				message: 'Failed to delete interview'
			});
		}

		redirect(302, '/app/interviews');
	}
};
