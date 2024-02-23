import { db } from '$lib/db';
import { question, userInterview, answer } from '$lib/db/schema';
import type { Question } from '$lib/types';
import { fail } from '@sveltejs/kit';
import { and, eq, ilike, inArray } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	const user = session!.user;

	// Get all user interviews and the interview details
	const all = await db.query.userInterview.findMany({
		columns: {
			interviewId: true
		},
		where: eq(userInterview.userId, user.userId)
	});

	let questions: Question[] = [];

	if (all.length > 0) {
		questions = await db.query.question.findMany({
			with: {
				answers: {
					where: eq(answer.userId, user.userId)
				}
			},
			where: inArray(
				question.interviewId,
				all.map((i) => i.interviewId)
			)
		});
	} else {
		questions = [];
	}

	return {
		questions
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
			} else {
				questions = [];
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
