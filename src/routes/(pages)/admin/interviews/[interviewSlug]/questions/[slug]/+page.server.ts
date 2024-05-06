import { db } from '$lib/db';
import { question } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const slug = params.slug;

	const questionDetails = await db.query.question.findFirst({
		where: eq(question.slug, slug)
	});

	if (!questionDetails) {
		return error(404, 'Question not found');
	}

	return {
		questionDetails
	};
}) satisfies PageServerLoad;
