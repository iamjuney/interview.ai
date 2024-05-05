import { db } from '$lib/db';
import { answer, interview } from '$lib/db/schema';
import type { Interview, Question } from '$lib/types';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const session = await locals.auth.validate();

	const interviewDetails = (await db.query.interview.findFirst({
		where: eq(interview.interviewSlug, params.interviewSlug),
		with: {
			questions: true
		}
	})) as Interview;

	let questions: Question[] = interviewDetails.questions;

	return {
		interviewDetails,
		questions
	};
}) satisfies PageServerLoad;
