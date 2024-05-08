import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, not } from 'drizzle-orm';
import { db } from '$lib/db';
import { interview, question } from '$lib/db/schema';
import { v4 as uuidv4 } from 'uuid';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

const questionSchema = z.object({
	question: z.string().max(255),
	slug: z.string().max(255),
	video_url: z.string().max(255)
});

export const actions = {
	add: async ({ request }) => {
		const form = await superValidate(
			request,
			z
				.object({
					interview_slug: z.string().max(255)
				})
				.merge(questionSchema)
		);

		if (!form.valid) {
			return fail(400, {
				message: 'Invalid question data'
			});
		}

		// check if question already exists
		const existingQuestion = await db.query.question.findFirst({
			where: eq(question.question, form.data.question)
		});

		if (existingQuestion) {
			return fail(400, {
				message: 'Question already exists'
			});
		}

		try {
			// get interview_id
			const interviewQuery = await db.query.interview.findFirst({
				where: eq(interview.interviewSlug, form.data.interview_slug)
			});

			if (!interviewQuery) {
				return fail(404, {
					message: 'Interview not found'
				});
			}

			await db.insert(question).values({
				id: uuidv4(),
				interviewId: interviewQuery.id,
				question: form.data.question,
				slug: form.data.slug,
				videoUrl: form.data.video_url
			});
		} catch (error) {
			return fail(500, {
				message: 'Failed to add question'
			});
		}

		redirect(302, `/admin/interviews/${form.data.interview_slug}`);
	},

	update: async ({ request }) => {
		const form = await superValidate(
			request,
			z
				.object({
					question_id: z.string().max(255),
					interview_slug: z.string().max(255)
				})
				.merge(questionSchema)
		);

		if (!form.valid) {
			return fail(400, {
				message: 'Invalid question data'
			});
		}

		// check if question already exists and is not the same question
		const existingQuestion = await db.query.question.findFirst({
			where: and(
				eq(question.question, form.data.question),
				not(eq(question.id, form.data.question_id))
			)
		});

		if (existingQuestion) {
			return fail(400, {
				message: 'Question already exists'
			});
		}

		try {
			await db
				.update(question)
				.set({
					question: form.data.question,
					slug: form.data.slug,
					videoUrl: form.data.video_url
				})
				.where(eq(question.id, form.data.question_id));
		} catch (error) {
			return fail(500, {
				message: 'Failed to update question'
			});
		}

		redirect(302, `/admin/interviews/${form.data.interview_slug}`);
	},

	delete: async ({ request }) => {
		const form = await superValidate(
			request,
			z.object({
				question_id: z.string().max(255),
				interview_slug: z.string().max(255)
			})
		);

		if (!form.valid) {
			return fail(400, {
				message: 'Invalid question data'
			});
		}

		try {
			await db.delete(question).where(eq(question.id, form.data.question_id));
		} catch (error) {
			return fail(500, {
				message: 'Failed to delete question'
			});
		}

		redirect(302, `/admin/interviews/${form.data.interview_slug}`);
	}
};
