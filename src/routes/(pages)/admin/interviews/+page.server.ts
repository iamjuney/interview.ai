import { db } from '$lib/db';
import { interview } from '$lib/db/schema';
import type { Interview } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';
import { asc, eq, ilike, or } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	let interviews = (await db.query.interview.findMany({
		with: {
			questions: true
		},
		orderBy: [asc(interview.position)]
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
			let interviews = (await db.query.interview.findMany({
				with: {
					questions: true
				},
				orderBy: [asc(interview.position)],
				where: or(
					ilike(interview.difficulty, `%${form.data.query}%`),
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
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const interviewId = form.get('interview_id')!.toString();

		try {
			// delete the interview
			await db.delete(interview).where(eq(interview.id, interviewId));
		} catch (error) {
			return fail(500, {
				message: 'Failed to delete interview'
			});
		}

		redirect(302, '/admin/interviews');
	}
};
