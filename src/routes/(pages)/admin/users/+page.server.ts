import { db } from '$lib/db';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	let users = await db.query.user.findMany({
		orderBy: (user, { asc }) => [asc(user.first_name)],
		where: (user, { eq }) => eq(user.role, 'user'),
		columns: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			image: true,
			createdAt: true
		}
	});

	let completed = 0;
	let totalQuestionsAnswered = 0;

	return {
		users
	};
}) satisfies PageServerLoad;

const searchSchema = z.object({
	query: z.string().max(255)
});

export const actions = {
	search: async ({ request }) => {
		const form = await superValidate(request, searchSchema);
		if (!form.valid) {
			return fail(400, {
				message: 'Invalid search query'
			});
		}
		try {
			let users = await db.query.user.findMany({
				orderBy: (user, { asc }) => [asc(user.first_name)],
				where: (user, { and, or, eq, ilike }) =>
					and(
						eq(user.role, 'user'),
						or(
							ilike(user.first_name, `%${form.data.query}%`),
							ilike(user.last_name, `%${form.data.query}%`),
							ilike(user.email, `%${form.data.query}%`)
						)
					),
				columns: {
					id: true,
					first_name: true,
					last_name: true,
					email: true,
					image: true
				}
			});
			return {
				users
			};
		} catch (error) {
			return fail(500, {
				message: 'Failed to search interviews'
			});
		}
	}
};
