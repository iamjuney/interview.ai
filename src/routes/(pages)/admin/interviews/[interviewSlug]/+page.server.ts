import { db } from '$lib/db';
import { interview } from '$lib/db/schema';
import type { Interview, Question } from '$lib/types';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
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
