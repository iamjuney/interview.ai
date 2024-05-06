import { db } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const userDetails = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, params.id)
	});

	if (!userDetails) {
		return {
			status: 404,
			error: new Error('User not found')
		};
	}

	return {
		userDetails
	};
}) satisfies PageServerLoad;
