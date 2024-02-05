import { db } from '$lib/db';
import { interview, userInterview } from '$lib/db/schema';
import type { Interview } from '$lib/types';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const session = await locals.auth.validate();
	const userId = session!.user.userId.toString();

	const res = (await db.query.interview.findFirst({
		where: eq(interview.slug, params.slug),
		with: {
			questions: true
		}
	})) as Interview;

	const status = await db.query.userInterview.findFirst({
		columns: {
			id: true,
			status: true
		},
		where: and(eq(userInterview.userId, userId), eq(userInterview.interviewId, res.id))
	});

	return {
		res,
		status: status?.status,
		id: status?.id
	};
}) satisfies PageServerLoad;
