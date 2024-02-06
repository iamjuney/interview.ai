import { db } from '$lib/db';
import { interview, userInterview } from '$lib/db/schema';
import type { Interview } from '$lib/types';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const session = await locals.auth.validate();
	const userId = session!.user.userId.toString();

	const interviewDetails = (await db.query.interview.findFirst({
		where: eq(interview.slug, params.slug),
		with: {
			questions: true
		}
	})) as Interview;

	const userInterviewDetails = await db.query.userInterview.findFirst({
		where: and(eq(userInterview.userId, userId), eq(userInterview.interviewId, interviewDetails.id))
	});

	return {
		interviewDetails,
		userInterviewDetails
	};
}) satisfies PageServerLoad;
