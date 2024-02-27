import { db } from '$lib/db';
import { answer, question, userInterview } from '$lib/db/schema';
import type { Question } from '$lib/types';
import { error, fail } from '@sveltejs/kit';
import { and, eq, ilike, inArray } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	const userId = session?.user.userId;

	if (!userId) {
		error(401, 'Unauthorized');
	}

	// Get all user interviews and the interview details
	const all = await db.query.userInterview.findMany({
		columns: {
			interviewId: true
		},
		where: eq(userInterview.userId, userId)
	});

	if (all.length === 0) {
		return {
			questions: []
		};
	}

	const prepared = db.query.question
		.findMany({
			with: {
				answers: {
					where: eq(answer.userId, userId)
				}
			},
			where: inArray(
				question.interviewId,
				all.map((i) => i.interviewId)
			)
		})
		.prepare('questionQuery');

	return {
		questions: await prepared.execute()
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
		const userId = session?.user.userId;

		if (!userId) {
			error(401, 'Unauthorized');
		}

		try {
			// Get all user interviews and the interview details
			const all = await db.query.userInterview.findMany({
				columns: {
					interviewId: true
				},
				where: eq(userInterview.userId, userId)
			});

			let questions: Question[] = [];

			if (all.length > 0) {
				questions = await db.query.question.findMany({
					with: {
						answers: {
							where: eq(answer.userId, userId)
						}
					},
					where: and(
						inArray(
							question.interviewId,
							all.map((i) => i.interviewId)
						),
						ilike(question.question, `%${form.data.query}%`)
					)
				});
			}

			return {
				questions
			};
		} catch (error) {
			return fail(500, {
				message: 'Failed to search interviews'
			});
		}
	}
};
