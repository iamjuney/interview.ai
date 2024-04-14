import { db } from '$lib/db';
import { answer, userInterview } from '$lib/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { PageServerLoad } from './$types';
import type { Interview, UserInterview } from '$lib/types';

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
		} catch (error) {
			return fail(500, {
				message: 'Failed to add interview'
			});
		}

		redirect(302, `/app/interviews`);
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const userInterviewId = form.get('user_interview_id')!.toString();

		try {
			await db.delete(userInterview).where(eq(userInterview.id, userInterviewId));

			// TODO: delete all videos and answers associated with the interview
		} catch (error) {
			return fail(500, {
				message: 'Failed to delete interview'
			});
		}

		redirect(302, '/app/interviews');
	}
};
