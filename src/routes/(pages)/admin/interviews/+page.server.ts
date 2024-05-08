import { db } from '$lib/db';
import { interview } from '$lib/db/schema';
import type { Interview } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';
import { asc, eq, ilike, or } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { v4 as uuidv4 } from 'uuid';
import { goto } from '$app/navigation';

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

const interviewSchema = z.object({
	position: z.string().max(255),
	interview_slug: z.string().max(255),
	description: z.string().max(255),
	difficulty: z.string().max(255),
	duration: z.number().int().positive()
});

export const actions = {
	add: async ({ request }) => {
		const form = await superValidate(request, interviewSchema);

		if (!form.valid) {
			return fail(400, {
				message: 'Invalid interview data'
			});
		}

		// check if interview position already exists
		const existingInterview = await db.query.interview.findFirst({
			where: eq(interview.position, form.data.position)
		});

		if (existingInterview) {
			return fail(400, {
				message: 'Interview position already exists'
			});
		}

		try {
			await db.insert(interview).values({
				id: uuidv4(),
				position: form.data.position,
				interviewSlug: form.data.interview_slug,
				description: form.data.description,
				difficulty: form.data.difficulty,
				duration: form.data.duration
			});
		} catch (error) {
			return fail(500, {
				message: 'Failed to add interview'
			});
		}

		redirect(302, '/admin/interviews');
	},

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
		const form = await superValidate(request, z.object({ interview_id: z.string() }));

		try {
			// delete the interview
			await db.delete(interview).where(eq(interview.id, form.data.interview_id));
		} catch (error) {
			return fail(500, {
				message: 'Failed to delete interview'
			});
		}

		redirect(301, '/admin/interviews');
	}
};
