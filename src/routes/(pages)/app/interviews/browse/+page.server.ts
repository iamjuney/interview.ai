import { db } from '$lib/db';
import { interview, userInterview } from '$lib/db/schema';
import type { Interview } from '$lib/types';
import { fail } from '@sveltejs/kit';
import { eq, ilike, not, notExists, or, notInArray, and } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	const userId = session!.user.userId.toString();

	// Get all user interviews
	const userInterviews = await db.query.userInterview.findMany({
		columns: {
			interviewId: true
		},
		where: eq(userInterview.userId, userId)
	});

	// Get all interviews that the user has not taken
	const interviews = (await db.query.interview.findMany({
		with: {
			questions: true
		},
		where: (interview, { notInArray }) =>
			notInArray(
				interview.id,
				userInterviews.map((ui) => ui.interviewId)
			)
	})) as Interview[];

	return {
		interviews
	};
}) satisfies PageServerLoad;

const searchSchema = z.object({
	query: z.string().max(255)
});

export const actions = {
	search: async ({ request, locals }) => {
		const form = await superValidate(request, searchSchema);

		if (!form.valid) {
			return fail(400, {
				message: 'Invalid search query'
			});
		}

		const session = await locals.auth.validate();
		const userId = session!.user.userId.toString();

		// Get all user interviews
		const userInterviews = await db.query.userInterview.findMany({
			columns: {
				interviewId: true
			},
			where: eq(userInterview.userId, userId)
		});

		try {
			// Search for interviews
			const interviews = (await db.query.interview.findMany({
				with: {
					questions: true
				},
				where: and(
					notInArray(
						interview.id,
						userInterviews.map((ui) => ui.interviewId)
					),
					or(
						ilike(interview.company, `%${form.data.query}%`),
						ilike(interview.position, `%${form.data.query}%`),
						ilike(interview.description, `%${form.data.query}%`)
					)
				)
			})) as Interview[];

			return {
				interviews
			};
		} catch (error) {
			return fail(500, {
				message: 'Failed to search interviews'
			});
		}
	}
};
