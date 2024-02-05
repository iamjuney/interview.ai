import type { PageServerLoad } from './$types';
import type { Interview } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { userInterview } from '$lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	const userId = session!.user.userId.toString();

	// Get all user interviews and the interview details
	const all = await db.query.userInterview.findMany({
		with: {
			interview: {
				with: {
					questions: true
				}
			}
		},
		where: eq(userInterview.userId, userId)
	});

	// filter where status is in-progress
	const in_progress = all.filter((interview) => interview.status === 'in-progress');

	// filter where status is completed
	const completed = all.filter((interview) => interview.status === 'completed');

	return { all, in_progress, completed };
}) satisfies PageServerLoad;

export const actions = {
	add: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		const userId = session!.user.userId;

		const form = await request.formData();
		const interviewId = form.get('interview_id')!.toString();
		const interviewSlug = form.get('interview_slug')!.toString();

		try {
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

		redirect(302, `/app/interviews/${interviewSlug}`);
	}
};
