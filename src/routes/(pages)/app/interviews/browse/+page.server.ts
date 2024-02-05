import { db } from '$lib/db';
import { interview } from '$lib/db/schema';
import type { Interview } from '$lib/types';
import { fail } from '@sveltejs/kit';
import { ilike, or } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const interviews = (await db.query.interview.findMany({
		with: {
			questions: true
		}
	})) as Interview[];

	return {
		interviews
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
			const interviews = (await db.query.interview.findMany({
				with: {
					questions: true
				},
				where: or(
					ilike(interview.company, `%${form.data.query}%`),
					ilike(interview.position, `%${form.data.query}%`),
					ilike(interview.description, `%${form.data.query}%`)
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
